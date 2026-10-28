const NotificationService = require('../services/notificationService');
const ApiResponse = require('../utils/apiResponse');

class NotificationController {
  static async getNotifications(req, res, next) {
    try {
      const { page, limit, unreadOnly } = req.query;
      const result = await NotificationService.getUserNotifications(req.user.id, {
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        unreadOnly: unreadOnly === 'true'
      });
      return ApiResponse.success(res, result.notifications, 'Notifications retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req, res, next) {
    try {
      await NotificationService.markAsRead(req.params.id, req.user.id);
      return ApiResponse.success(res, null, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req, res, next) {
    try {
      await NotificationService.markAllAsRead(req.user.id);
      return ApiResponse.success(res, null, 'All notifications marked as read');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = NotificationController;
