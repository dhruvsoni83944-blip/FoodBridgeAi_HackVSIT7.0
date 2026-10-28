const { GoogleGenAI } = require('@google/genai');

/**
 * Enterprise-grade Gemini Vision Service for FoodBridge AI
 * Implements strict rubric-based Visual Quality Scoring and conservative donation recommendations.
 */
class GeminiVisionService {
  /**
   * Evaluates an uploaded food image using Google Gemini Vision API
   * @param {Object} params
   * @param {Buffer} params.imageBuffer - Raw image buffer
   * @param {string} params.mimeType - Image MIME type (image/jpeg, image/png, image/webp)
   * @param {string} [params.foodCategory] - Optional food category hint
   * @returns {Promise<Object>} Structured inspection result
   */
  static async analyzeFoodImage({ imageBuffer, mimeType, foodCategory = null }) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey.includes('your-google-gemini-api-key')) {
      const error = new Error('GEMINI_API_KEY is not configured on the server. Please configure a valid Google Gemini API key in backend/.env.');
      error.code = 'GEMINI_KEY_MISSING';
      error.status = 503;
      throw error;
    }

    if (!imageBuffer || !Buffer.isBuffer(imageBuffer) || imageBuffer.length === 0) {
      const error = new Error('Invalid or empty image buffer provided for analysis.');
      error.code = 'INVALID_IMAGE_BUFFER';
      error.status = 400;
      throw error;
    }

    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowedMimes.includes(mimeType?.toLowerCase())) {
      const error = new Error(`Unsupported image MIME type: ${mimeType}. Allowed formats: JPEG, PNG, WebP.`);
      error.code = 'UNSUPPORTED_MIME_TYPE';
      error.status = 400;
      throw error;
    }

    const base64Data = imageBuffer.toString('base64');
    const ai = new GoogleGenAI({ apiKey });
    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
      'gemini-3.1-flash-lite',
      'gemini-3.5-flash-lite',
      'gemini-3.8-flash'
    ];

    const promptText = `
You are an expert food safety inspector evaluating an image for FoodBridge AI surplus rescue network.
Inspect the food image with rigorous objective visual criteria.

Examine these 8 specific visual indicators:
1. Visible mold or fungal-like growth: Look for fuzzy white, blue, green, or black patches. Describe only observable patches supported by visual evidence.
2. Abnormal color changes: Look for unusual discoloration, grayish tint, slime sheen, or unnatural darkening, while considering the food type and normal cooking colors.
3. Dryness or texture changes: Look for observable severe shriveling, wilting, excessive crusting, drying, or abnormal texture.
4. Burn marks: CRITICALLY IMPORTANT: Distinguish normal browning, roasting, grill marks, toasted spots (e.g. on naan, roti, toasted bread, grilled vegetables) from unusually heavy black charring. Normal toasting is NOT a defect.
5. Visible contamination: Look for apparent foreign objects, insects, hair, dirt, or packaging debris.
6. Packaging condition: If containers/wrappers are visible, inspect for tears, leaks, broken seals, or exposed food. If no packaging is visible (e.g. food on a plate/tray), mark status as "uncertain" or "not_observed" with explanation "Packaging not visible in image".
7. Food appearance: Identify the likely food name/type and summarize visible condition.
8. Image quality: Detect blur, poor lighting, low resolution, obstruction, or insufficient visual evidence.

CRITICAL RULES:
- If the image DOES NOT depict food (e.g., furniture, electronics, document, animal, outdoor landscape without food), set "isFood": false.
- Do NOT treat normal cooking spices, herbs, pepper flecks, grill marks, toasted spots, or natural variations as mold or contamination without distinct visual proof.
- "not_observed" means no visible evidence was found in the image. It does not prove absence of invisible defects.

You must respond ONLY with valid JSON conforming to this schema:
{
  "isFood": boolean,
  "foodIdentified": string,
  "foodCategory": string,
  "overallCondition": string,
  "imageQuality": {
    "isAdequate": boolean,
    "issues": string[],
    "explanation": string
  },
  "indicators": {
    "mold_growth": {
      "status": "observed" | "not_observed" | "uncertain",
      "explanation": string,
      "confidence": "high" | "medium" | "low"
    },
    "abnormal_color": {
      "status": "observed" | "not_observed" | "uncertain",
      "explanation": string,
      "confidence": "high" | "medium" | "low"
    },
    "texture_dryness": {
      "status": "observed" | "not_observed" | "uncertain",
      "explanation": string,
      "confidence": "high" | "medium" | "low"
    },
    "burn_marks": {
      "status": "observed" | "not_observed" | "uncertain",
      "isNormalBrowning": boolean,
      "explanation": string,
      "confidence": "high" | "medium" | "low"
    },
    "visible_contamination": {
      "status": "observed" | "not_observed" | "uncertain",
      "explanation": string,
      "confidence": "high" | "medium" | "low"
    },
    "packaging_condition": {
      "status": "observed" | "not_observed" | "uncertain",
      "explanation": string,
      "confidence": "high" | "medium" | "low"
    }
  },
  "concerns": string[],
  "limitations": string
}
`;

    let rawResponseText = '';
    let usedModel = candidateModels[0];
    let lastError = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: base64Data
                  }
                },
                {
                  text: promptText
                }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.1
          }
        });

        rawResponseText = response?.text || '';
        usedModel = model;
        if (rawResponseText) break;
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiVisionService] Model ${model} returned: ${err.message}. Trying next candidate if available...`);
      }
    }

    if (!rawResponseText) {
      console.error('[GeminiVisionService] All Gemini candidate models failed:', lastError?.message);
      const err = new Error(this._formatApiErrorMessage(lastError));
      err.code = lastError?.status === 429 ? 'RATE_LIMITED' : 'GEMINI_API_FAILURE';
      err.status = lastError?.status || 502;
      throw err;
    }

    // Parse and strictly validate Gemini's JSON output
    const parsedData = this._parseGeminiJson(rawResponseText);
    return this._synthesizeScoringAndRecommendation(parsedData, usedModel);
  }

  /**
   * Synthesizes deterministic rubric-based score, confidence, and conservative recommendations
   */
  static _synthesizeScoringAndRecommendation(data, modelName) {
    // Case 1: Non-food image detected
    if (!data.isFood) {
      return {
        qualityScore: null,
        assessmentConfidence: 'low',
        foodIdentified: 'Non-food content',
        foodCategory: 'N/A',
        overallCondition: data.overallCondition || 'Uploaded image does not appear to contain recognizable food items.',
        ratingTier: 'Assessment Not Possible (Non-Food)',
        recommendation: 'review_required',
        recommendationTitle: 'Unable to Assess Reliably — Retake Image or Request Review',
        recommendationColor: 'amber',
        findings: [
          {
            category: 'Food Recognition',
            name: 'non_food_detected',
            status: 'uncertain',
            explanation: 'The provided image does not clearly depict edible surplus food.',
            confidence: 'low',
            pointsDeducted: 0,
            isConcern: true
          }
        ],
        concerns: ['Image does not contain recognizable food items.'],
        scoreBreakdown: {
          baseline: 0,
          deductions: [],
          finalScore: null
        },
        limitations: 'Visual analysis is designed specifically for food items. Non-food objects cannot be analyzed for freshness or donation suitability.',
        disclaimer: 'AI Visual Quality Assessment only. Not a guarantee of food safety. Final donation approval is subject to human review.',
        modelIdentifier: modelName,
        analyzedAt: new Date().toISOString()
      };
    }

    // Case 2: Inadequate image quality
    const imageQuality = data.imageQuality || { isAdequate: true, issues: [], explanation: '' };
    const indicators = data.indicators || {};

    let score = 100;
    const deductions = [];
    const findings = [];
    const concerns = Array.isArray(data.concerns) ? [...data.concerns] : [];

    // Rubric: Mold / Fungal Spoilage
    const mold = indicators.mold_growth || { status: 'not_observed', explanation: 'No visible mold observed', confidence: 'medium' };
    if (mold.status === 'observed') {
      score -= 75;
      deductions.push({ reason: 'Observed visible mold or fungal colonies', points: 75 });
      if (!concerns.some(c => c.toLowerCase().includes('mold'))) {
        concerns.unshift('Visible mold or fungal-like growth detected.');
      }
    } else if (mold.status === 'uncertain') {
      score -= 10;
      deductions.push({ reason: 'Uncertain visible surface patch requires inspection', points: 10 });
    }
    findings.push({
      category: 'Mold Detection',
      name: 'mold_growth',
      status: mold.status,
      explanation: mold.explanation || (mold.status === 'observed' ? 'Suspicious fungal patches visible.' : 'No visible fungal growth detected.'),
      confidence: mold.confidence || 'medium',
      pointsDeducted: mold.status === 'observed' ? 75 : (mold.status === 'uncertain' ? 10 : 0),
      isConcern: mold.status === 'observed'
    });

    // Rubric: Visible Contamination
    const contam = indicators.visible_contamination || { status: 'not_observed', explanation: 'No visible contamination observed', confidence: 'medium' };
    if (contam.status === 'observed') {
      score -= 60;
      deductions.push({ reason: 'Observed visible foreign contamination', points: 60 });
      if (!concerns.some(c => c.toLowerCase().includes('contamination'))) {
        concerns.unshift('Visible contamination or foreign object observed.');
      }
    } else if (contam.status === 'uncertain') {
      score -= 10;
      deductions.push({ reason: 'Uncertain visible particle requires inspection', points: 10 });
    }
    findings.push({
      category: 'Contamination',
      name: 'visible_contamination',
      status: contam.status,
      explanation: contam.explanation || (contam.status === 'observed' ? 'Visible foreign particles observed.' : 'No visible foreign contamination detected.'),
      confidence: contam.confidence || 'medium',
      pointsDeducted: contam.status === 'observed' ? 60 : (contam.status === 'uncertain' ? 10 : 0),
      isConcern: contam.status === 'observed'
    });

    // Rubric: Abnormal Discoloration
    const color = indicators.abnormal_color || { status: 'not_observed', explanation: 'Normal color', confidence: 'medium' };
    if (color.status === 'observed') {
      score -= 25;
      deductions.push({ reason: 'Observed abnormal discoloration or spoilage sheen', points: 25 });
    } else if (color.status === 'uncertain') {
      score -= 5;
      deductions.push({ reason: 'Color variation needs confirmation', points: 5 });
    }
    findings.push({
      category: 'Color & Browning',
      name: 'abnormal_color',
      status: color.status,
      explanation: color.explanation || (color.status === 'observed' ? 'Unusual discoloration observed.' : 'Natural food color verified.'),
      confidence: color.confidence || 'medium',
      pointsDeducted: color.status === 'observed' ? 25 : (color.status === 'uncertain' ? 5 : 0),
      isConcern: color.status === 'observed'
    });

    // Rubric: Burn Marks (Distinguishing normal toasting from heavy charring)
    const burns = indicators.burn_marks || { status: 'not_observed', isNormalBrowning: true, explanation: 'No abnormal burning', confidence: 'medium' };
    if (burns.status === 'observed') {
      if (burns.isNormalBrowning) {
        // Normal toasting, roasted edges, or roti spots -> NO deduction
        findings.push({
          category: 'Burn Marks & Toasting',
          name: 'burn_marks',
          status: 'observed',
          explanation: burns.explanation || 'Normal toasted cooking marks consistent with standard preparation.',
          confidence: burns.confidence || 'high',
          pointsDeducted: 0,
          isConcern: false
        });
      } else {
        score -= 20;
        deductions.push({ reason: 'Heavy charring or excessive burning detected', points: 20 });
        findings.push({
          category: 'Burn Marks & Toasting',
          name: 'burn_marks',
          status: 'observed',
          explanation: burns.explanation || 'Excessive burnt or heavily charred surface regions.',
          confidence: burns.confidence || 'medium',
          pointsDeducted: 20,
          isConcern: true
        });
      }
    } else {
      findings.push({
        category: 'Burn Marks & Toasting',
        name: 'burn_marks',
        status: burns.status || 'not_observed',
        explanation: burns.explanation || 'No excessive burn marks detected.',
        confidence: burns.confidence || 'medium',
        pointsDeducted: 0,
        isConcern: false
      });
    }

    // Rubric: Dryness & Texture
    const texture = indicators.texture_dryness || { status: 'not_observed', explanation: 'Normal moisture', confidence: 'medium' };
    if (texture.status === 'observed') {
      score -= 15;
      deductions.push({ reason: 'Observed severe dryness, staling, or shriveling', points: 15 });
    } else if (texture.status === 'uncertain') {
      score -= 5;
      deductions.push({ reason: 'Texture moisture balance uncertain', points: 5 });
    }
    findings.push({
      category: 'Texture & Moisture',
      name: 'texture_dryness',
      status: texture.status,
      explanation: texture.explanation || (texture.status === 'observed' ? 'Visible texture degradation or dryness.' : 'Appropriate texture and moisture observable.'),
      confidence: texture.confidence || 'medium',
      pointsDeducted: texture.status === 'observed' ? 15 : (texture.status === 'uncertain' ? 5 : 0),
      isConcern: texture.status === 'observed'
    });

    // Rubric: Packaging Condition
    const packaging = indicators.packaging_condition || { status: 'not_observed', explanation: 'Packaging clean', confidence: 'medium' };
    if (packaging.status === 'observed') {
      score -= 20;
      deductions.push({ reason: 'Observed damaged packaging, torn seal, or leakage', points: 20 });
      findings.push({
        category: 'Packaging Integrity',
        name: 'packaging_condition',
        status: 'observed',
        explanation: packaging.explanation || 'Damaged seal or leakage observed.',
        confidence: packaging.confidence || 'medium',
        pointsDeducted: 20,
        isConcern: true
      });
    } else if (packaging.status === 'uncertain') {
      findings.push({
        category: 'Packaging Integrity',
        name: 'packaging_condition',
        status: 'uncertain',
        explanation: packaging.explanation || 'Packaging not visible or cannot be assessed from this view.',
        confidence: 'medium',
        pointsDeducted: 0,
        isConcern: false
      });
    } else {
      findings.push({
        category: 'Packaging Integrity',
        name: 'packaging_condition',
        status: 'not_observed',
        explanation: packaging.explanation || 'No packaging damage or leakage observed.',
        confidence: packaging.confidence || 'medium',
        pointsDeducted: 0,
        isConcern: false
      });
    }

    // Rubric: Image Quality & Obstruction
    if (!imageQuality.isAdequate || (imageQuality.issues && imageQuality.issues.length > 0 && !imageQuality.issues.includes('none'))) {
      score -= 15;
      deductions.push({ reason: 'Suboptimal image quality, blur, or partial obstruction', points: 15 });
      findings.push({
        category: 'Image Quality',
        name: 'image_quality',
        status: 'observed',
        explanation: imageQuality.explanation || `Image quality issues detected: ${imageQuality.issues.join(', ')}.`,
        confidence: 'medium',
        pointsDeducted: 15,
        isConcern: true
      });
    } else {
      findings.push({
        category: 'Image Quality',
        name: 'image_quality',
        status: 'not_observed',
        explanation: imageQuality.explanation || 'Adequate lighting and sharpness for visual surface inspection.',
        confidence: 'high',
        pointsDeducted: 0,
        isConcern: false
      });
    }

    // Clamp score to 0–100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    // Determine Assessment Confidence
    let assessmentConfidence = 'high';
    const uncertainCount = findings.filter(f => f.status === 'uncertain').length;
    if (!imageQuality.isAdequate || uncertainCount >= 2 || data.foodIdentified?.toLowerCase() === 'unknown') {
      assessmentConfidence = 'low';
    } else if (uncertainCount === 1 || (imageQuality.issues && imageQuality.issues.length > 0 && !imageQuality.issues.includes('none'))) {
      assessmentConfidence = 'medium';
    }

    // Determine Conservative Recommendation (Section 5)
    let recommendation = 'no_obvious_visual_concerns';
    let recommendationTitle = 'No Obvious Visual Concerns — Further Safety Checks Required';
    let recommendationColor = 'green';
    let ratingTier = `${finalScore}/100 (Good Visual Condition)`;

    const hasObservedCriticalDefect = mold.status === 'observed' || contam.status === 'observed';
    const isUnreliableOrInadequate = assessmentConfidence === 'low' || !imageQuality.isAdequate || uncertainCount >= 2;

    if (hasObservedCriticalDefect) {
      // Obvious serious visual defects identified
      recommendation = 'visual_concerns_detected';
      recommendationTitle = 'Visual Concerns Detected — Hold for Human Review';
      recommendationColor = 'red';
      ratingTier = `${finalScore}/100 (Unsatisfactory — Visible Spoilage or Contamination)`;
    } else if (isUnreliableOrInadequate) {
      // Evidence is uncertain, image is inadequate, or assessment cannot be made reliably
      recommendation = 'review_required';
      recommendationTitle = 'Unable to Assess Reliably — Retake Image or Request Review';
      recommendationColor = 'amber';
      ratingTier = `${finalScore}/100 (Uncertain Assessment Reliability)`;
    } else if (finalScore < 70 || burns.status === 'observed' && !burns.isNormalBrowning || color.status === 'observed' || texture.status === 'observed') {
      recommendation = 'visual_concerns_detected';
      recommendationTitle = 'Visual Concerns Detected — Hold for Human Review';
      recommendationColor = 'red';
      ratingTier = `${finalScore}/100 (Noticeable Surface Degradation)`;
    } else {
      recommendation = 'no_obvious_visual_concerns';
      recommendationTitle = 'No Obvious Visual Concerns — Further Safety Checks Required';
      recommendationColor = 'green';
      ratingTier = finalScore >= 90 ? `${finalScore}/100 (Optimal Visual Condition)` : `${finalScore}/100 (Acceptable Visual Condition)`;
    }


    return {
      qualityScore: finalScore,
      assessmentConfidence,
      foodIdentified: data.foodIdentified || 'Assorted Food',
      foodCategory: data.foodCategory || 'Prepared Surplus',
      overallCondition: data.overallCondition || 'Visual characteristics documented.',
      ratingTier,
      recommendation,
      recommendationTitle,
      recommendationColor,
      findings,
      concerns,
      scoreBreakdown: {
        baseline: 100,
        deductions,
        finalScore
      },
      limitations: data.limitations || 'Microbial activity, internal temperature, pathogens (e.g. Salmonella, Listeria), taste, smell, and chemical safety cannot be verified by visual analysis. Standard hygiene and temperature history checks must be satisfied prior to human consumption.',
      disclaimer: 'AI Visual Quality Score is an optical surface assessment only and is not a laboratory test, food-safety guarantee, or certification (not FSSAI/WHO approved). Final distribution is subject to mandatory human physical inspection and organizational food safety protocols.',
      modelIdentifier: modelName,
      analyzedAt: new Date().toISOString()
    };
  }

  /**
   * Safe parser for Gemini JSON responses
   */
  static _parseGeminiJson(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      throw new Error('Gemini returned an empty or invalid response.');
    }

    // Strip markdown code fences if present (e.g. ```json ... ```)
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error('[GeminiVisionService] Failed to parse JSON from Gemini:', rawText);
      throw new Error('Gemini vision model returned malformed output that could not be parsed as valid JSON.');
    }
  }

  /**
   * Formats friendly user-facing error messages
   */
  static _formatApiErrorMessage(error) {
    const msg = error.message || '';
    if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
      return 'The configured GEMINI_API_KEY is invalid. Please verify your Google Gemini API key.';
    }
    if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota') || error.status === 429) {
      return 'Google Gemini API rate limit or quota exceeded. Please wait a few moments and try again.';
    }
    if (msg.includes('DEADLINE_EXCEEDED') || msg.includes('timeout')) {
      return 'The Gemini visual analysis request timed out. Please try uploading the image again.';
    }
    return `Gemini API communication error: ${msg}`;
  }
}

module.exports = GeminiVisionService;
