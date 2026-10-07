const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/user.model');
const env = require('../config/env');

const protect = asyncHandler(async (req, res, next) => {
  // 1. Read the token from the Authorization header: "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ApiError(401, 'You are not logged in. Please log in to continue');
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify the token (checks the signature AND the expiry)
  //    If invalid or expired, jwt.verify throws, and the global error handler
  //    turns it into a 401 with a clear message
  const decoded = jwt.verify(token, env.JWT_SECRET, { algorithms: ['HS256'] });

  // 3. Make sure the user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new ApiError(401, 'The user belonging to this token no longer exists');
  }

  // 4. Make sure the account is still active
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated');
  }

    // 4b. Reject tokens that were issued before the last password change
  if (user.changedPasswordAfter(decoded.iat)) {
    throw new ApiError(401, 'Password was changed recently. Please log in again');
  }

  // 5. Attach the user to the request so later code can use it
  req.user = user;
  next();
});




// Usage: restrictTo('admin')  or  restrictTo('admin', 'seller')
const restrictTo = (...allowedRoles) => (req, res, next) => {
  // Safety check: protect must have run before this middleware
  if (!req.user) {
    return next(new ApiError(401, 'You are not logged in. Please log in to continue'));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action'));
  }

  next();
};

module.exports = { protect, restrictTo };
