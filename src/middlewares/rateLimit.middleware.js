const rateLimit = require('express-rate-limit');
const ApiError = require('../utils/ApiError');

// Build every limiter the same way, so errors keep your standard JSON format
const createLimiter = ({ windowMs, limit, message, skipSuccessfulRequests = false }) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: true,   // sends RateLimit-* headers so clients know their limit
    legacyHeaders: false,    // no old X-RateLimit-* headers
    skipSuccessfulRequests,
    handler: (req, res, next) => next(new ApiError(429, message)),
  });

// Whole API: a broad safety net
const apiLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  message: 'Too many requests. Please try again later',
});

// Login: 10 FAILED attempts per 15 minutes per IP (successful logins are not counted)
const loginLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  message: 'Too many login attempts. Please try again in 15 minutes',
});

// Routes that send emails: 5 per hour per IP
const emailLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  message: 'Too many requests. Please try again in an hour',
});

// Registration: 10 per hour per IP
const registerLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  message: 'Too many accounts created from this address. Please try again later',
});

module.exports = { apiLimiter, loginLimiter, emailLimiter, registerLimiter };