class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;          // optional list, e.g. validation errors
    this.isOperational = true;     // marks it as an expected error, not a bug
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;