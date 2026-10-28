const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/users - Authenticated ADMIN access to view and filter users by role
router.get('/', authenticate, authorize('ADMIN'), AdminController.getUsers);

module.exports = router;
