const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests from this IP address, please try again after 15 minutes.',
      429
    );
  }
});

// Stricter limiter for authentication routes (login/register)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // Limit each IP to 30 requests per window for auth
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many authentication attempts from this IP, please try again after 15 minutes.',
      429
    );
  }
});

module.exports = {
  apiLimiter,
  authLimiter
};
