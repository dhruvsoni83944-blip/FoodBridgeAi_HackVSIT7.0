const { param, body } = require('express-validator');

const acceptDeliveryValidator = [
  param('id')
    .isUUID()
    .withMessage('Valid Delivery ID is required')
];

const updateDeliveryStatusValidator = [
  param('id')
    .isUUID()
    .withMessage('Valid Delivery ID is required'),
  body('status')
    .isIn(['PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CONFIRMED', 'CANCELLED'])
    .withMessage('Status must be one of: PICKED_UP, IN_TRANSIT, DELIVERED, CONFIRMED, CANCELLED'),
  body('verificationCode')
    .optional()
    .isString()
    .trim()
];

module.exports = {
  acceptDeliveryValidator,
  updateDeliveryStatusValidator
};
