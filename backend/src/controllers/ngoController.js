const DeliveryService = require('../services/deliveryService');
const { prisma } = require('../config/db');
const { calculateDistanceKm } = require('../utils/distance');
const ApiResponse = require('../utils/apiResponse');

class NGOController {
  /**
   * POST /api/donations/:id/request
   * NGO submits request for an available donation
   */
  static async requestDonation(req, res, next) {
    try {
      const request = await DeliveryService.requestDonation({
        donationId: req.params.id,
        ngoUserId: req.user.id,
        notes: req.body.notes
      });
      return ApiResponse.created(res, request, 'Donation requested successfully. Donor has been notified.');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ngo/requests
   * Retrieves all food requests made by authenticated NGO
   */
  static async getNGORequests(req, res, next) {
    try {
      const requests = await prisma.nGORequest.findMany({
        where: { ngoId: req.user.id },
        include: {
          donation: {
            include: {
              donor: { select: { id: true, name: true, phone: true, donorProfile: true } },
              analysis: true
            }
          },
          delivery: {
            include: {
              volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
            }
          }
        },
        orderBy: { requestedAt: 'desc' }
      });
      return ApiResponse.success(res, requests, 'NGO requests retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ngo/donations
   * Retrieves donations allocated or delivered to this NGO
   */
  static async getNGODonations(req, res, next) {
    try {
      const requests = await prisma.nGORequest.findMany({
        where: {
          ngoId: req.user.id,
          status: 'ACCEPTED'
        },
        include: {
          donation: {
            include: {
              donor: { select: { id: true, name: true, phone: true, donorProfile: true } },
              analysis: true,
              deliveries: {
                include: {
                  volunteer: { select: { id: true, name: true, phone: true, volunteerProfile: true } }
                }
              }
            }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      const donations = requests.map(r => ({
        ...r.donation,
        requestId: r.id,
        requestNotes: r.notes
      }));

      return ApiResponse.success(res, donations, 'NGO allocated donations retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/ngos/nearby
   * Lists NGOs near given coordinates
   */
  static async getNearbyNGOs(req, res, next) {
    try {
      const { latitude, longitude, radiusKm = 20 } = req.query;
      const lat = parseFloat(latitude || (req.user.donorProfile?.latitude || 28.6139));
      const lon = parseFloat(longitude || (req.user.donorProfile?.longitude || 77.209));
      const radius = parseFloat(radiusKm);

      const ngos = await prisma.nGOProfile.findMany({
        include: {
          user: {
            select: { id: true, name: true, phone: true, email: true, isVerified: true }
          }
        }
      });

      const nearby = ngos
        .map(ngo => {
          const distanceKm = calculateDistanceKm(lat, lon, ngo.latitude, ngo.longitude);
          return {
            ...ngo,
            distanceKm
          };
        })
        .filter(ngo => ngo.distanceKm <= radius)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      return ApiResponse.success(res, nearby, 'Nearby NGOs retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/deliveries/:id/confirm
   * NGO confirms food arrival at shelter
   */
  static async confirmDelivery(req, res, next) {
    try {
      const confirmed = await DeliveryService.confirmReceiptByNGO({
        deliveryId: req.params.id,
        ngoUserId: req.user.id
      });
      return ApiResponse.success(res, confirmed, 'Food delivery safely verified and confirmed by NGO');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NGOController;
