const crypto = require('crypto');

const hashToken = (token) =>
  crypto.createHash('sha256').update(token).digest('hex');

// Creates a random token and its hash
const generateRandomToken = () => {
  const token = crypto.randomBytes(32).toString('hex'); // 64 characters, goes in the email
  return { token, hashedToken: hashToken(token) };      // hashedToken goes in the database
};


module.exports = { hashToken, generateRandomToken };