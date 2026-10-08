const nodemailer = require('nodemailer');
const env = require('../config/env');
const logger = require('./logger');
const ApiError = require('./ApiError');

let transporter;

// Create the connection object once and reuse it
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_PORT === 465, // true only for port 465, false for 587/2525
      auth: { user: env.EMAIL_USER, pass: env.EMAIL_PASS },
      connectionTimeout: 10000, // give up connecting after 10 seconds
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });
  }
  return transporter;
};

const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await getTransporter().sendMail({
      from: env.EMAIL_FROM || env.EMAIL_USER,
      to,
      subject,
      text, // plain-text version
      html, // HTML version
    });

    logger.info(`Email sent to ${to} (id: ${info.messageId})`);

    // Ethereal only: log a link where you can view the email
    if (env.NODE_ENV !== 'production') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) logger.info(`Email preview: ${previewUrl}`);
    }

    return info;
  } catch (err) {
    logger.error(`Failed to send email to ${to}: ${err.message}`);
    throw new ApiError(500, 'Email could not be sent. Please try again later');
  }
};

module.exports = sendEmail;


