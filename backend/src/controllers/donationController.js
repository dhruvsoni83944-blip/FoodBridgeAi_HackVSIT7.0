const DonationService = require('../services/donationService');
const MatchingService = require('../services/matchingService');
const DeliveryService = require('../services/deliveryService');
const ApiResponse = require('../utils/apiResponse');

class DonationController {
  static async createDonation(req, res, next) {
    try {
      const donation = await DonationService.createDonation({
        donorId: req.user.id,
        file: req.file,
        ...req.body
      });
      return ApiResponse.created(res, donation, 'Food donation listed successfully with AI analysis');
    } catch (error) {
      next(error);
    }
  }

  static async getDonations(req, res, next) {
    try {
      const { page, limit, status, foodType, donorId, search } = req.query;
      const result = await DonationService.getDonations({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        status,
        foodType,
        donorId,
        search
      });
      return ApiResponse.success(res, result.donations, 'Donations retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getDonationById(req, res, next) {
    try {
      const donation = await DonationService.getDonationById(req.params.id);
      if (!donation) {
        return ApiResponse.notFound(res, 'Food donation not found');
      }
      return ApiResponse.success(res, donation, 'Donation details retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async updateDonation(req, res, next) {
    try {
      const updated = await DonationService.updateDonation(req.params.id, req.user.id, req.body);
      return ApiResponse.success(res, updated, 'Food donation updated successfully');
    } catch (error) {
      next(error);
    }
  }

  static async deleteDonation(req, res, next) {
    try {
      const cancelled = await DonationService.deleteDonation(req.params.id, req.user.id);
      return ApiResponse.success(res, cancelled, 'Food donation cancelled successfully');
    } catch (error) {
      next(error);
    }
  }

  static async getNearbyDonations(req, res, next) {
    try {
      const { latitude, longitude, radiusKm, status } = req.query;
      const nearby = await DonationService.getNearbyDonations({
        latitude,
        longitude,
        radiusKm,
        status
      });
      return ApiResponse.success(res, nearby, 'Nearby food donations retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async getSmartMatches(req, res, next) {
    try {
      const matches = await MatchingService.matchNGOsForDonation(req.params.id);
      return ApiResponse.success(res, matches, 'Ranked smart NGO matches retrieved');
    } catch (error) {
      next(error);
    }
  }

  static async acceptNGORequest(req, res, next) {
    try {
      const { requestId } = req.body;
      const delivery = await DeliveryService.acceptNGORequest({
        requestId,
        donorUserId: req.user.id
      });
      return ApiResponse.success(res, delivery, 'NGO request accepted and delivery task generated');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DonationController;
