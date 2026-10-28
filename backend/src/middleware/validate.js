const { validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/**
 * Validates the express-validator results on the current request
 */
function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));
    return ApiResponse.badRequest(res, 'Validation failed for one or more fields', formattedErrors);
  }
  next();
}

module.exports = validate;
