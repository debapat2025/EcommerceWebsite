const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const env = require('../config/env');

// 404 handler: runs when no route matched
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Convert known library errors into ApiError
const handleCastError = (err) =>
  new ApiError(400, `Invalid ${err.path}: ${err.value}`);

const handleDuplicateKey = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new ApiError(409, `${field} already exists`);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => ({
    field: e.path,
    message: e.message,
  }));
  return new ApiError(400, 'Validation failed', errors);
};

const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') return new ApiError(413, 'File is too large. Maximum size is 2 MB');
  if (err.code === 'LIMIT_UNEXPECTED_FILE') return new ApiError(400, 'Wrong field name. Use "avatar" for the image');
  return new ApiError(400, err.message);
};

// Global error handler: must have 4 parameters and be registered LAST
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err.name === 'CastError') error = handleCastError(err);
  else if (err.code === 11000) error = handleDuplicateKey(err);
  else if (err.name === 'ValidationError') error = handleValidationError(err);
  else if (err.name === 'JsonWebTokenError')
    error = new ApiError(401, 'Invalid token. Please log in again');
  else if (err.name === 'TokenExpiredError')
    error = new ApiError(401, 'Token expired. Please log in again');
    else if (err.name === 'MulterError') error = handleMulterError(err);

  const statusCode = error.statusCode || 500;
  const isOperational = error.isOperational === true;

  // Log: bugs as errors with stack trace, expected errors as warnings
  if (!isOperational) {
    logger.error(`${req.method} ${req.originalUrl} - ${err.stack}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} - ${statusCode} ${error.message}`);
  }

  const showRealMessage = isOperational || env.NODE_ENV === 'development';

  res.status(statusCode).json({
    success: false,
    message: showRealMessage ? error.message : 'Something went wrong',
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    // ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };