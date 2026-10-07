require('dotenv').config();

const required = ['MONGO_URI', 'JWT_SECRET' ,'JWT_REFRESH_SECRET'];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

// Email settings are optional at startup, but warn so you notice early
['EMAIL_HOST', 'EMAIL_USER', 'EMAIL_PASS'].forEach((key) => {
  if (!process.env[key]) {
    console.warn(`Warning: ${key} is not set. Emails will not work`);
  }
});


// module.exports = {
//   NODE_ENV: process.env.NODE_ENV || 'development',
//   PORT: process.env.PORT || 3000,
//   HOST:  process.env.HOST || localhost,
//   MONGO_URI: process.env.MONGO_URI,
//   JWT_SECRET: process.env.JWT_SECRET,
//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
//   CLIENT_URL: process.env.CLIENT_URL,
// };


module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  API_URL: process.env.API_URL || 'http://localhost:5000',

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: Number(process.env.EMAIL_PORT) || 587,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,
};