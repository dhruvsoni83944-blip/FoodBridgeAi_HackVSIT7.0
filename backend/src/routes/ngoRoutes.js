const express = require('express');
const router = express.Router();
const NGOController = require('../controllers/ngoController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/ngo/requests (NGO requests history)
router.get('/requests', authenticate, authorize('NGO', 'ADMIN'), NGOController.getNGORequests);

// GET /api/ngo/donations (Donations allocated to this NGO)
router.get('/donations', authenticate, authorize('NGO', 'ADMIN'), NGOController.getNGODonations);

// GET /api/ngos/nearby (Nearby NGOs list)
router.get('/nearby', NGOController.getNearbyNGOs);

module.exports = router;
