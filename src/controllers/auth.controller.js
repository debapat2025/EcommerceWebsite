const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { COOKIE_NAME, setRefreshCookie,clearRefreshCookie } = require('../utils/cookie');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const { user ,emailSent} = await authService.register({ name, email, password });

  // res.status(201).json({
  //   success: true,
  //   message: 'Registration successful. Please log in.',
  //   data: { user },
  // });
    res.status(201).json({
    success: true,
    message: emailSent
      ? 'Registration successful. Please check your email to verify your account.'
      : 'Registration successful, but we could not send the verification email. Please request a new one.',
    data: { user },
  });
});


const verifyEmail = asyncHandler(async (req, res) => {
  await authService.verifyEmail(req.params.token);

  res.status(200).json({
    success: true,
    message: 'Email verified successfully. You can now log in.',
  });
});

const resendVerification = asyncHandler(async (req, res) => {
  await authService.resendVerification(req.body.email);

  res.status(200).json({
    success: true,
    message: 'If an unverified account exists for that email, a new verification link has been sent.',
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


const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const { accessToken, refreshToken } = await authService.changePassword(
    req.user._id,
    currentPassword,
    newPassword
  );

  setRefreshCookie(res, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
    data: { accessToken },
  });
});


//forget and rest password
const forgotPassword = asyncHandler(async (req, res) => {
  await authService.forgotPassword(req.body.email);

  res.status(200).json({
    success: true,
    message: 'If an account exists for that email, a password reset link has been sent.',
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);

  clearRefreshCookie(res); // remove any old session cookie in this browser

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please log in with your new password.',
  });
});

module.exports = {
  register, login, refreshToken, logout, changePassword,
  verifyEmail, resendVerification, forgotPassword, resetPassword,
};