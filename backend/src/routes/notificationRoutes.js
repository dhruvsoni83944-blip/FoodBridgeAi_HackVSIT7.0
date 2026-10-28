const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

// GET /api/notifications
router.get('/', NotificationController.getNotifications);

// PATCH /api/notifications/read-all
router.patch('/read-all', NotificationController.markAllAsRead);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', NotificationController.markAsRead);

module.exports = router;
