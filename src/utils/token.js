const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: String(user._id), role: user.role }, // payload
    env.JWT_SECRET,                            // secret used to sign
    { expiresIn: env.JWT_EXPIRES_IN }          // token dies after 15 minutes
  );
};

module.exports = { generateAccessToken };