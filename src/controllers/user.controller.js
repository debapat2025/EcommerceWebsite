const asyncHandler = require('../utils/asyncHandler');

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile fetched',
    data: { user: req.user },
  });
});

module.exports = { getMe };