const { prisma } = require('../config/db');
const { uploadImageBuffer } = require('../config/cloudinary');
const AIClientService = require('./aiClientService');
const NotificationService = require('./notificationService');
const { calculateDistanceKm, getBoundingBox } = require('../utils/distance');
const { isValidDonationTransition } = require('../utils/stateMachine');

class DonationService {
  /**
   * Creates a food donation with image upload and automated AI freshness assessment
   */
  static async createDonation({ donorId, file, ...donationData }) {
    // 1. Upload food image
    let imageUrl = donationData.imageUrl || null;
    if (file && file.buffer) {
      imageUrl = await uploadImageBuffer(file.buffer, 'foodbridge/donations', file.originalname);
    }

    // 2. Call AI Vision service for food freshness analysis
    const aiResult = await AIClientService.analyzeFood({
      imageUrl,
      foodCategory: donationData.foodType,
      imageBuffer: file ? file.buffer : null
    });

    // 3. Create donation and AI analysis record in a Prisma transaction
    const donation = await prisma.$transaction(async (tx) => {
      const created = await tx.foodDonation.create({
        data: {
          donorId,
          foodName: donationData.foodName,
          foodType: donationData.foodType,
          quantity: parseFloat(donationData.quantity),
          unit: donationData.unit || 'kg',
          peopleFedCount: donationData.peopleFedCount
            ? parseInt(donationData.peopleFedCount, 10)
            : Math.floor(parseFloat(donationData.quantity) * 2.5),
          preparationTime: donationData.preparationTime ? new Date(donationData.preparationTime) : new Date(),
          consumeBefore: new Date(donationData.consumeBefore),
          description: donationData.description || null,
          imageUrl: imageUrl || '/ai_food_match.jpg',
          pickupAddress: donationData.pickupAddress,
          latitude: parseFloat(donationData.latitude),
          longitude: parseFloat(donationData.longitude),
          status: 'AVAILABLE'
        }
      });

      // Save AI analysis results
      await tx.foodAnalysis.create({
        data: {
          donationId: created.id,
          freshnessScore: aiResult.freshnessScore,
          condition: aiResult.condition,
          confidence: aiResult.confidence,
          checks: aiResult.checks || [],
          disclaimer: aiResult.disclaimer || 'AI-assisted visual freshness assessment, not a guarantee of food safety.',
          rawResult: aiResult.metadata || null
        }
      });

      return created;
    });

    // 4. Notify nearby verified NGOs about the newly available surplus food
    this._notifyNearbyNGOs(donation);

    return this.getDonationById(donation.id);
  }

  /**
   * Asynchronously finds and notifies NGOs within 15 km radius
   */
  static async _notifyNearbyNGOs(donation) {
    try {
      const ngos = await prisma.nGOProfile.findMany({
        include: { user: true }
      });

      const notifications = [];
      for (const ngo of ngos) {
        const dist = calculateDistanceKm(
          donation.latitude,
          donation.longitude,
          ngo.latitude,
          ngo.longitude
        );

        if (dist !== null && dist <= 15.0) {
          notifications.push({
            userId: ngo.userId,
            title: 'New Surplus Food Available Nearby! 🍲',
            message: `A donor listed ${donation.quantity} ${donation.unit} of '${donation.foodName}' approx ${dist} km away from your shelter.`,
            type: 'NGO_REQUEST',
            metadata: { donationId: donation.id, distanceKm: dist }
          });
        }
      }

      if (notifications.length > 0) {
        await NotificationService.createManyNotifications(notifications);
      }
    } catch (err) {
      console.warn('[DonationService] Error notifying nearby NGOs:', err.message);
    }
  }

  /**
   * Fetches paginated food donations with filters
   */
  static async getDonations({ page = 1, limit = 20, status, foodType, donorId, search }) {
    const skip = (page - 1) * limit;
    const where = {};

    if (status) where.status = status;
    if (foodType) where.foodType = { contains: foodType, mode: 'insensitive' };
    if (donorId) where.donorId = donorId;
    if (search) {
      where.OR = [
        { foodName: { contains: search, mode: 'insensitive' } },
        { pickupAddress: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [donations, total] = await Promise.all([
      prisma.foodDonation.findMany({
        where,
        include: {
          donor: {
            select: { id: true, name: true, phone: true, email: true, donorProfile: true }
          },
          analysis: true,
          requests: {
            include: {
              ngo: { select: { id: true, name: true, phone: true, ngoProfile: true } }
            }
          },
          deliveries: {
            include: {
              volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.foodDonation.count({ where })
    ]);

    return {
      donations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Retrieves single donation by ID
   */
  static async getDonationById(id) {
    return prisma.foodDonation.findUnique({
      where: { id },
      include: {
        donor: {
          select: { id: true, name: true, phone: true, email: true, donorProfile: true }
        },
        analysis: true,
        requests: {
          include: {
            ngo: { select: { id: true, name: true, phone: true, ngoProfile: true } }
          }
        },
        deliveries: {
          include: {
            volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
          }
        }
      }
    });
  }

  /**
   * Updates donation details (only permitted if still AVAILABLE)
   */
  static async updateDonation(id, donorId, updateData) {
    const donation = await prisma.foodDonation.findUnique({ where: { id } });
    if (!donation) {
      const error = new Error('Food donation not found.');
      error.statusCode = 404;
      throw error;
    }

    if (donation.donorId !== donorId) {
      const error = new Error('Unauthorized: You are not the owner of this donation.');
      error.statusCode = 403;
      throw error;
    }

    if (donation.status !== 'AVAILABLE') {
      const error = new Error(`Cannot edit donation because its status is already '${donation.status}'.`);
      error.statusCode = 400;
      throw error;
    }

    return prisma.foodDonation.update({
      where: { id },
      data: {
        foodName: updateData.foodName || undefined,
        quantity: updateData.quantity ? parseFloat(updateData.quantity) : undefined,
        consumeBefore: updateData.consumeBefore ? new Date(updateData.consumeBefore) : undefined,
        pickupAddress: updateData.pickupAddress || undefined,
        description: updateData.description !== undefined ? updateData.description : undefined
      },
      include: { analysis: true }
    });
  }

  /**
   * Cancels or deletes donation
   */
  static async deleteDonation(id, donorId) {
    const donation = await prisma.foodDonation.findUnique({
      where: { id },
      include: { deliveries: true }
    });

    if (!donation) {
      const error = new Error('Food donation not found.');
      error.statusCode = 404;
      throw error;
    }

    if (donation.donorId !== donorId) {
      const error = new Error('Unauthorized: You are not the owner of this donation.');
      error.statusCode = 403;
      throw error;
    }

    const activeDelivery = donation.deliveries.find(
      d => d.status === 'PICKED_UP' || d.status === 'IN_TRANSIT'
    );
    if (activeDelivery) {
      const error = new Error('Cannot delete donation while it is actively out for delivery.');
      error.statusCode = 400;
      throw error;
    }

    return prisma.foodDonation.update({
      where: { id },
      data: { status: 'CANCELLED' }
    });
  }

  /**
   * Retrieves donations within a specified geographic radius
   */
  static async getNearbyDonations({ latitude, longitude, radiusKm = 10, status = 'AVAILABLE' }) {
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const radius = parseFloat(radiusKm);

    // Fast bounding box filtering
    const box = getBoundingBox(lat, lon, radius);

    const candidateDonations = await prisma.foodDonation.findMany({
      where: {
        status,
        latitude: { gte: box.minLat, lte: box.maxLat },
        longitude: { gte: box.minLon, lte: box.maxLon },
        consumeBefore: { gt: new Date() } // Filter out expired food
      },
      include: {
        donor: {
          select: { id: true, name: true, phone: true, donorProfile: true }
        },
        analysis: true
      }
    });

    // Exact Haversine distance calculation and sorting
    const nearby = candidateDonations
      .map(donation => {
        const distanceKm = calculateDistanceKm(lat, lon, donation.latitude, donation.longitude);
        return {
          ...donation,
          distanceKm
        };
      })
      .filter(item => item.distanceKm <= radius)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return nearby;
  }
}

module.exports = DonationService;
