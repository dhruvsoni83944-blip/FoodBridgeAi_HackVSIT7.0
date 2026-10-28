const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require ADMIN role
router.use(authenticate, authorize('ADMIN'));

// GET /api/admin/users
router.get('/users', AdminController.getUsers);

// GET /api/admin/donations
router.get('/donations', AdminController.getDonations);

// GET /api/admin/deliveries
router.get('/deliveries', AdminController.getDeliveries);

// GET /api/admin/statistics
router.get('/statistics', AdminController.getStatistics);

// PATCH /api/admin/users/:id/verify
router.patch('/users/:id/verify', AdminController.verifyUser);

module.exports = router;
