const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

/**
 * Middleware to authenticate requests using JWT Bearer tokens
 */
async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.unauthorized(res, 'Authentication required. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'foodbridge_default_jwt_secret';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.unauthorized(res, 'Token has expired. Please login again.');
      }
      return ApiResponse.unauthorized(res, 'Invalid token.');
    }

    // Fetch user from DB to ensure user is active and exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        donorProfile: true,
        ngoProfile: true,
        volunteerProfile: true
      }
    });

    if (!user) {
      return ApiResponse.unauthorized(res, 'User associated with this token no longer exists.');
    }

    // Attach user (without password hash) to request object
    const { passwordHash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Middleware to restrict access based on user role(s)
 * @param  {...string} roles Allowed roles (e.g. 'DONOR', 'NGO', 'VOLUNTEER', 'ADMIN')
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Authentication required.');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(
        res,
        `Access denied. Requires one of the following roles: ${roles.join(', ')}`
      );
    }

    next();
  };
}

/**
 * Optional authentication: attaches req.user if a valid token is provided,
 * but allows the request to continue if no token is present.
 */
async function optionalAuthenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'foodbridge_default_jwt_secret';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch {
      return next();
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        donorProfile: true,
        ngoProfile: true,
        volunteerProfile: true
      }
    });

    if (user) {
      const { passwordHash, ...userWithoutPassword } = user;
      req.user = userWithoutPassword;
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  authenticate,
  optionalAuthenticate,
  authorize
};
