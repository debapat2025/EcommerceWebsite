const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { COOKIE_NAME, setRefreshCookie,clearRefreshCookie } = require('../utils/cookie');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user } = await authService.register({ name, email, password });

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please log in.',
    data: { user },
  });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, accessToken ,refreshToken} = await authService.login({ email, password });

setRefreshCookie(res, refreshToken);   // refresh token goes in the cookie only


  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken },
  });
});


const refreshToken = asyncHandler(async (req, res) => {
  const incomingToken = req.cookies[COOKIE_NAME];

  const { accessToken, refreshToken: newRefreshToken } =
    await authService.refreshAccessToken(incomingToken);

  setRefreshCookie(res, newRefreshToken);

  res.status(200).json({
    success: true,
    message: 'Token refreshed',
    data: { accessToken },
  });
});


const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies[COOKIE_NAME]);

  clearRefreshCookie(res);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});



module.exports = { register , login, refreshToken ,logout};