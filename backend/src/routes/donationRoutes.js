const express = require('express');
const router = express.Router();
const DonationController = require('../controllers/donationController');
const NGOController = require('../controllers/ngoController');
const {
  createDonationValidator,
  updateDonationValidator,
  nearbyDonationsValidator
} = require('../validators/donationValidator');
const { createRequestValidator } = require('../validators/requestValidator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// GET /api/donations/nearby
router.get('/nearby', nearbyDonationsValidator, validate, DonationController.getNearbyDonations);

// GET /api/donations
router.get('/', DonationController.getDonations);

// POST /api/donations (Donor only)
router.post(
  '/',
  authenticate,
  authorize('DONOR', 'ADMIN'),
  upload.single('image'),
  createDonationValidator,
  validate,
  DonationController.createDonation
);

// GET /api/donations/:id
router.get('/:id', DonationController.getDonationById);

// PATCH /api/donations/:id (Donor only)
router.patch(
  '/:id',
  authenticate,
  authorize('DONOR', 'ADMIN'),
  updateDonationValidator,
  validate,
  DonationController.updateDonation
);

// DELETE /api/donations/:id (Donor only)
router.delete(
  '/:id',
  authenticate,
  authorize('DONOR', 'ADMIN'),
  DonationController.deleteDonation
);

// GET /api/donations/:id/match-ngos (Smart NGO matching)
router.get(
  '/:id/match-ngos',
  authenticate,
  authorize('DONOR', 'ADMIN'),
  DonationController.getSmartMatches
);

// POST /api/donations/:id/request (NGO requests food)
router.post(
  '/:id/request',
  authenticate,
  authorize('NGO', 'ADMIN'),
  createRequestValidator,
  validate,
  NGOController.requestDonation
);

// POST /api/donations/:id/accept-request (Donor accepts NGO request)
router.post(
  '/:id/accept-request',
  authenticate,
  authorize('DONOR', 'ADMIN'),
  DonationController.acceptNGORequest
);

module.exports = router;
