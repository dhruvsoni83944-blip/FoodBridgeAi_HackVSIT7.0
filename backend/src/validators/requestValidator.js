const { param, body } = require('express-validator');

const createRequestValidator = [
  param('id')
    .isUUID()
    .withMessage('A valid donation ID is required in URL path'),
  body('notes')
    .optional()
    .isString()
    .trim()
];

module.exports = {
  createRequestValidator
};
