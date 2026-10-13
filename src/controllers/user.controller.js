const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');
const { clearRefreshCookie } = require('../utils/cookie');

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile fetched',
    data: { user: req.user },
  });
});

const updateMe = asyncHandler(async (req, res) => {
    console.log('Request body:', req.body);
  console.log('Authenticated user ID:', req.user._id);
  const user = await userService.updateMe(req.user._id, req.body, req.file);

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});


const deactivateMe = asyncHandler(async (req, res) => {
  await userService.deactivateMe(req.user._id, req.body.password);

  clearRefreshCookie(res); // remove the login cookie from the browser

  res.status(200).json({
    success: true,
    message: 'Your account has been deactivated',
  });
});

module.exports = { getMe, updateMe, deactivateMe };
