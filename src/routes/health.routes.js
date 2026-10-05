const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');


router.get('/test-error', asyncHandler(async () => {
  throw new ApiError(400, 'This is a test error');
}));



router.get('/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;

  res.status(dbConnected ? 200 : 503).json({
    success: dbConnected,
    status: dbConnected ? 'ok' : 'degraded',
    db: dbConnected ? 'connected' : 'disconnected',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;