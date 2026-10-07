const jwt = require('jsonwebtoken');
const env = require('../config/env');
const crypto = require('crypto');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: String(user._id), role: user.role }, // payload
    env.JWT_SECRET,                            // secret used to sign
    { expiresIn: env.JWT_EXPIRES_IN }          // token dies after 15 minutes
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: String(user._id) },                 // only the id, role is read from DB
    env.JWT_REFRESH_SECRET,
    {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      jwtid: crypto.randomUUID(),             // makes every token unique
    }
  );
};

const verifyRefreshToken = (token) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: ['HS256'] });


module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };