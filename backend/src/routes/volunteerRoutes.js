const express = require('express');
const router = express.Router();
const VolunteerController = require('../controllers/volunteerController');
const NGOController = require('../controllers/ngoController');
const {
  acceptDeliveryValidator,
  updateDeliveryStatusValidator
} = require('../validators/deliveryValidator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/volunteer/jobs (Matching missions for volunteer)
router.get('/jobs', authenticate, authorize('VOLUNTEER', 'ADMIN'), VolunteerController.getJobs);

// GET /api/volunteer/deliveries (Volunteer's active & completed deliveries)
router.get('/deliveries', authenticate, authorize('VOLUNTEER', 'ADMIN'), VolunteerController.getDeliveries);

// Note: Delivery actions are mounted under both /api/volunteer and /api/deliveries for convenience
// POST /api/volunteer/deliveries/:id/accept
router.post(
  '/deliveries/:id/accept',
  authenticate,
  authorize('VOLUNTEER', 'ADMIN'),
  acceptDeliveryValidator,
  validate,
  VolunteerController.acceptDelivery
);

// PATCH /api/volunteer/deliveries/:id/status
router.patch(
  '/deliveries/:id/status',
  authenticate,
  authorize('VOLUNTEER', 'ADMIN'),
  updateDeliveryStatusValidator,
  validate,
  VolunteerController.updateDeliveryStatus
);

// POST /api/volunteer/deliveries/:id/confirm (NGO confirms delivery)
router.post(
  '/deliveries/:id/confirm',
  authenticate,
  authorize('NGO', 'ADMIN'),
  NGOController.confirmDelivery
);

module.exports = router;
