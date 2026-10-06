const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken } = require('../utils/token');



const register = async ({ name, email, password }) => {
  // 1. Check if the email is already used
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  // 2. Create the user (password is hashed by the pre-save hook in the model)
  const user = await User.create({ name, email, password });

//   // 3. Create the access token
//   const accessToken = generateAccessToken(user);

  return { user};
};


const login = async ({ email, password }) => {
  // 1. Find the user. The password has select:false, so we must ask for it explicitly
  const user = await User.findOne({ email }).select('+password');

  // 2. Same error for "no such user" and "wrong password"
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3. Only after the password is correct, check the account status
  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact support');
  }

  // 4. Create the access token
  const accessToken = generateAccessToken(user);

  return { user, accessToken };
};

module.exports = { register, login };