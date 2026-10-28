/**
 * Standardized API Response Utilities
 */

class ApiResponse {
  static success(res, data = null, message = "Success", statusCode = 200, meta = null) {
    const payload = {
      success: true,
      message,
      data
    };
    if (meta) {
      payload.meta = meta;
    }
    return res.status(statusCode).json(payload);
  }

  static created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, 201);
  }

  static error(res, message = "Internal Server Error", statusCode = 500, errors = null) {
    const payload = {
      success: false,
      message
    };
    if (errors) {
      payload.errors = errors;
    }
    return res.status(statusCode).json(payload);
  }

  static badRequest(res, message = "Bad Request", errors = null) {
    return this.error(res, message, 400, errors);
  }

  static unauthorized(res, message = "Unauthorized access") {
    return this.error(res, message, 401);
  }

  static forbidden(res, message = "Forbidden: Insufficient privileges") {
    return this.error(res, message, 403);
  }

  static notFound(res, message = "Resource not found") {
    return this.error(res, message, 404);
  }

  static conflict(res, message = "Conflict with existing state") {
    return this.error(res, message, 409);
  }
}

module.exports = ApiResponse;
