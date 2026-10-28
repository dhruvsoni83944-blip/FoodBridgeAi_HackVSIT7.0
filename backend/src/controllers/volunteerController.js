const DeliveryService = require('../services/deliveryService');
const ApiResponse = require('../utils/apiResponse');

class VolunteerController {
  /**
   * GET /api/volunteer/jobs
   * Retrieves available delivery missions matching volunteer carrying capacity and proximity
   */
  static async getJobs(req, res, next) {
    try {
      const jobs = await DeliveryService.getAvailableVolunteerJobs(req.user.id);
      return ApiResponse.success(res, jobs, 'Available volunteer delivery missions retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/volunteer/deliveries
   * Retrieves volunteer's active and completed deliveries
   */
  static async getDeliveries(req, res, next) {
    try {
      const deliveries = await DeliveryService.getVolunteerDeliveries(req.user.id);
      return ApiResponse.success(res, deliveries, 'Volunteer deliveries retrieved');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/deliveries/:id/accept
   * Volunteer accepts a delivery mission
   */
  static async acceptDelivery(req, res, next) {
    try {
      const delivery = await DeliveryService.acceptDelivery({
        deliveryId: req.params.id,
        volunteerUserId: req.user.id
      });
      return ApiResponse.success(res, delivery, 'Delivery mission accepted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/deliveries/:id/status
   * Updates delivery status: PICKED_UP -> IN_TRANSIT -> DELIVERED
   */
  static async updateDeliveryStatus(req, res, next) {
    try {
      const updated = await DeliveryService.updateDeliveryStatus({
        deliveryId: req.params.id,
        volunteerUserId: req.user.id,
        newStatus: req.body.status,
        verificationCode: req.body.verificationCode
      });
      return ApiResponse.success(res, updated, `Delivery status updated to ${req.body.status}`);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = VolunteerController;
