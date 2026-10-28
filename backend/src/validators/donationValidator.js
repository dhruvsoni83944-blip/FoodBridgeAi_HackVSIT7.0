const { body, query, param } = require('express-validator');

const createDonationValidator = [
  body('foodName')
    .trim()
    .notEmpty()
    .withMessage('Food name is required'),
  body('foodType')
    .trim()
    .notEmpty()
    .withMessage('Food type/category is required'),
  body('quantity')
    .isFloat({ min: 0.1 })
    .withMessage('Quantity must be a positive number'),
  body('unit')
    .optional()
    .isString()
    .withMessage('Unit must be a valid string (e.g. kg, meals, boxes)'),
  body('peopleFedCount')
    .optional()
    .isInt({ min: 0 })
    .withMessage('peopleFedCount must be a non-negative integer'),
  body('consumeBefore')
    .isISO8601()
    .withMessage('consumeBefore must be a valid ISO 8601 date string')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('consumeBefore date/time must be in the future');
      }
      return true;
    }),
  body('pickupAddress')
    .trim()
    .notEmpty()
    .withMessage('Pickup address is required'),
  body('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid coordinate between -90 and 90'),
  body('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid coordinate between -180 and 180'),
  body('description')
    .optional()
    .isString()
];

const updateDonationValidator = [
  param('id')
    .isUUID()
    .withMessage('Valid donation UUID is required'),
  body('foodName').optional().trim().notEmpty(),
  body('quantity').optional().isFloat({ min: 0.1 }),
  body('consumeBefore').optional().isISO8601(),
  body('pickupAddress').optional().trim().notEmpty(),
  body('description').optional().isString()
];

const nearbyDonationsValidator = [
  query('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Query param latitude is required (-90 to 90)'),
  query('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Query param longitude is required (-180 to 180)'),
  query('radiusKm')
    .optional()
    .isFloat({ min: 0.5, max: 200 })
    .withMessage('radiusKm must be between 0.5 and 200')
];

module.exports = {
  createDonationValidator,
  updateDonationValidator,
  nearbyDonationsValidator
};
