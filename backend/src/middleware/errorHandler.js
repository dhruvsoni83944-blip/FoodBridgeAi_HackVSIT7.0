const ApiResponse = require('../utils/apiResponse');

/**
 * Global Express Error Handling Middleware
 */
function errorHandler(err, req, res, next) {
  // Log error in non-test environments
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  // Handle Prisma Database Errors
  if (err.code === 'P2002') {
    const target = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return ApiResponse.conflict(res, `A record with this ${target} already exists.`);
  }

  if (err.code === 'P2025') {
    return ApiResponse.notFound(res, err.meta?.cause || 'Record to operate on does not exist.');
  }

  if (err.code === 'P2003') {
    return ApiResponse.badRequest(res, 'Foreign key constraint failed.');
  }

  // Handle Multer upload errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return ApiResponse.badRequest(res, 'File too large. Maximum allowed size is 10 MB.');
    }
    return ApiResponse.badRequest(res, `File upload error: ${err.message}`);
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return ApiResponse.unauthorized(res, 'Invalid authentication token.');
  }

  // Handle generic validation or operational errors
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected internal server error occurred.';

  return ApiResponse.error(res, message, statusCode, err.errors || null);
}

module.exports = errorHandler;
