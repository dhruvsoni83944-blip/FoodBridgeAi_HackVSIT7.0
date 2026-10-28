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

// POST /api/deliveries/:id/accept (Volunteer accepts delivery)
router.post(
  '/:id/accept',
  authenticate,
  authorize('VOLUNTEER', 'ADMIN'),
  acceptDeliveryValidator,
  validate,
  VolunteerController.acceptDelivery
);

// PATCH /api/deliveries/:id/status (Volunteer updates status: PICKED_UP, IN_TRANSIT, DELIVERED)
router.patch(
  '/:id/status',
  authenticate,
  authorize('VOLUNTEER', 'ADMIN'),
  updateDeliveryStatusValidator,
  validate,
  VolunteerController.updateDeliveryStatus
);

// POST /api/deliveries/:id/confirm (NGO confirms receipt)
router.post(
  '/:id/confirm',
  authenticate,
  authorize('NGO', 'ADMIN'),
  NGOController.confirmDelivery
);

module.exports = router;
