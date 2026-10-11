const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile fetched',
    data: { user: req.user },
  });
});

const updateMe = asyncHandler(async (req, res) => {
    console.log('Request body:', req.body);
  console.log('Authenticated user ID:', req.user?._id);
  const user = await userService.updateMe(req.user._id, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});

module.exports = { getMe, updateMe };