const env = require('../config/env');

const COOKIE_NAME = 'refreshToken';
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // keep in sync with JWT_REFRESH_EXPIRES_IN

const baseOptions = {
  httpOnly: true,                              // JavaScript cannot read it
  secure: env.NODE_ENV === 'production',       // HTTPS only in production
  sameSite: 'strict',                          // not sent on cross-site requests
  path: '/api/v1/auth',                        // only sent to auth routes
};

const setRefreshCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, { ...baseOptions, maxAge: SEVEN_DAYS });
};

const clearRefreshCookie = (res) => {
  res.clearCookie(COOKIE_NAME, baseOptions);
};

module.exports = { COOKIE_NAME, setRefreshCookie, clearRefreshCookie };