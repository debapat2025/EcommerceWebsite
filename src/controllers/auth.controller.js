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

module.exports = { register };