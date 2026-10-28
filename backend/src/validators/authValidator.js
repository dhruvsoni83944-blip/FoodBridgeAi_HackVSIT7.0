const { body } = require('express-validator');

const registerValidator = [
  body('email')
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  body('role')
    .isIn(['DONOR', 'NGO', 'VOLUNTEER', 'ADMIN'])
    .withMessage('Role must be one of: DONOR, NGO, VOLUNTEER, ADMIN'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),

  // Role-specific fields validation (optional with fallbacks in authService)
  body('organizationName')
    .optional({ checkFalsy: true })
    .trim(),
  body('address')
    .optional({ checkFalsy: true })
    .trim(),
  body('latitude')
    .optional({ checkFalsy: true })
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be a valid float between -90 and 90'),
  body('longitude')
    .optional({ checkFalsy: true })
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be a valid float between -180 and 180')
];

const loginValidator = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

module.exports = {
  registerValidator,
  loginValidator
};
