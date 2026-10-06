const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');

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

  const { user, accessToken } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: { user, accessToken },
  });
});

module.exports = { register , login };