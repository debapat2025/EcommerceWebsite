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

module.exports = { register };