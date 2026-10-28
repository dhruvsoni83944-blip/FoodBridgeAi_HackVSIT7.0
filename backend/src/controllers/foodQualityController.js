const path = require('path');
const fs = require('fs');
const axios = require('axios');
const GeminiVisionService = require('../services/geminiVisionService');
const { uploadImageBuffer } = require('../config/cloudinary');
const { prisma } = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

class FoodQualityController {
  /**
   * POST /api/food-quality/analyze
   * Accepts multipart file upload (field name: 'image') or JSON with 'imageUrl'
   */
  static async analyzeFoodQuality(req, res, next) {
    try {
      let imageBuffer = null;
      let mimeType = null;
      let savedImageUrl = null;

      // 1. Check for multipart file upload
      if (req.file) {
        imageBuffer = req.file.buffer;
        mimeType = req.file.mimetype;

        try {
          savedImageUrl = await uploadImageBuffer(
            imageBuffer,
            'foodbridge/inspections',
            req.file.originalname || 'inspection.jpg'
          );
        } catch (uploadErr) {
          console.warn('[FoodQualityController] Image storage fallback:', uploadErr.message);
          savedImageUrl = `data:${mimeType};base64,${imageBuffer.toString('base64').substring(0, 50)}...`;
        }
      }
      // 2. Check for base64 image data in JSON body
      else if (req.body.imageBase64 || (req.body.image && req.body.image.startsWith('data:image/'))) {
        let b64 = req.body.imageBase64 || req.body.image;
        if (b64.includes('base64,')) {
          const parts = b64.split('base64,');
          mimeType = parts[0].replace('data:', '').replace(';', '').trim() || 'image/jpeg';
          b64 = parts[1];
        } else {
          mimeType = req.body.mimeType || 'image/jpeg';
        }
        imageBuffer = Buffer.from(b64, 'base64');
        savedImageUrl = `data:${mimeType};base64,${b64.substring(0, 50)}...`;
      }
      // 3. Alternatively check for imageUrl (e.g. from preset or remote URL)
      else if (req.body.imageUrl) {
        const url = req.body.imageUrl.trim();
        savedImageUrl = url;

        // If client sent a base64 data URI in imageUrl field
        if (url.startsWith('data:image/')) {
          const parts = url.split('base64,');
          mimeType = parts[0].replace('data:', '').replace(';', '').trim() || 'image/jpeg';
          imageBuffer = Buffer.from(parts[1], 'base64');
        }
        // Check if local public asset
        else if (url.startsWith('/')) {
          const publicPath = path.resolve(__dirname, '../../../public', url.replace(/^\//, ''));
          if (fs.existsSync(publicPath)) {
            imageBuffer = fs.readFileSync(publicPath);
            const ext = path.extname(publicPath).toLowerCase();
            mimeType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';
          }
        }
        // Remote HTTP/HTTPS URL
        else if (url.startsWith('http://') || url.startsWith('https://')) {
          try {
            const response = await axios.get(url, {
              responseType: 'arraybuffer',
              timeout: 10000,
              maxContentLength: 10 * 1024 * 1024 // 10MB limit
            });

            imageBuffer = Buffer.from(response.data);
            const headerMime = response.headers['content-type'];
            if (headerMime && headerMime.startsWith('image/')) {
              mimeType = headerMime.split(';')[0];
            } else {
              mimeType = 'image/jpeg';
            }
          } catch (downloadErr) {
            return ApiResponse.badRequest(res, `Unable to download image from the provided URL: ${downloadErr.message}`);
          }
        }
      }

      if (!imageBuffer) {
        return ApiResponse.badRequest(res, 'No food image provided. Please upload an image file (JPEG, PNG, WebP) or provide a valid imageUrl.');
      }

      // 3. Call Gemini Vision Service
      const result = await GeminiVisionService.analyzeFoodImage({
        imageBuffer,
        mimeType: mimeType || 'image/jpeg',
        foodCategory: req.body.foodCategory || null
      });

      // Attach image URL reference to result
      result.imageUrl = savedImageUrl;

      // 4. Persist analysis results in PostgreSQL database
      try {
        const donationId = req.body.donationId || null;
        const userId = req.user?.id || null;

        await prisma.foodQualityInspection.create({
          data: {
            userId,
            donationId,
            imageUrl: savedImageUrl || 'uploaded_image',
            qualityScore: result.qualityScore,
            assessmentConfidence: (result.assessmentConfidence || 'medium').toUpperCase(),
            foodIdentified: result.foodIdentified,
            overallCondition: result.overallCondition,
            recommendation: (result.recommendation || 'review_required').toUpperCase(),
            findings: result.findings,
            concerns: result.concerns,
            limitations: result.limitations,
            modelIdentifier: result.modelIdentifier || 'gemini-2.5-flash'
          }
        });

        // If this inspection is for a specific food donation in the database, update FoodAnalysis
        if (donationId) {
          const donationExists = await prisma.foodDonation.findUnique({
            where: { id: donationId }
          });

          if (donationExists) {
            await prisma.foodAnalysis.upsert({
              where: { donationId },
              create: {
                donationId,
                freshnessScore: result.qualityScore || 0,
                condition: result.ratingTier || 'INSPECTED',
                confidence: result.assessmentConfidence === 'high' ? 0.95 : (result.assessmentConfidence === 'medium' ? 0.8 : 0.6),
                checks: result.findings,
                disclaimer: result.disclaimer,
                rawResult: result
              },
              update: {
                freshnessScore: result.qualityScore || 0,
                condition: result.ratingTier || 'INSPECTED',
                confidence: result.assessmentConfidence === 'high' ? 0.95 : (result.assessmentConfidence === 'medium' ? 0.8 : 0.6),
                checks: result.findings,
                disclaimer: result.disclaimer,
                rawResult: result,
                analyzedAt: new Date()
              }
            });
          }
        }
      } catch (dbErr) {
        // Non-blocking database persistence note: do not fail client response if logging has minor error
        console.warn('[FoodQualityController] Database persistence warning:', dbErr.message);
      }

      return ApiResponse.success(res, result, 'Visual food quality analysis completed successfully.');
    } catch (error) {
      if (error.code === 'GEMINI_KEY_MISSING') {
        return res.status(503).json({
          success: false,
          code: 'GEMINI_KEY_MISSING',
          message: error.message,
          error: error.message
        });
      }
      if (error.code === 'UNSUPPORTED_MIME_TYPE' || error.code === 'INVALID_IMAGE_BUFFER') {
        return ApiResponse.badRequest(res, error.message);
      }
      if (error.code === 'RATE_LIMITED') {
        return res.status(429).json({
          success: false,
          code: 'RATE_LIMITED',
          message: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/food-quality/inspections
   * Retrieves inspection audit history for authenticated user/NGO
   */
  static async getInspections(req, res, next) {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const skip = (page - 1) * limit;

      const where = {};
      if (req.user && req.user.role !== 'ADMIN') {
        where.userId = req.user.id;
      }
      if (req.query.donationId) {
        where.donationId = req.query.donationId;
      }

      const [inspections, total] = await Promise.all([
        prisma.foodQualityInspection.findMany({
          where,
          orderBy: { analyzedAt: 'desc' },
          skip,
          take: limit
        }),
        prisma.foodQualityInspection.count({ where })
      ]);

      return ApiResponse.success(res, inspections, 'Inspections retrieved', 200, {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = FoodQualityController;

