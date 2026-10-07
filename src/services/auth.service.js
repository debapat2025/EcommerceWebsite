const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken ,generateRefreshToken,verifyRefreshToken} = require('../utils/token');
const { hashToken } = require('../utils/cryptoToken');


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

  // 4. Create the access token and refresh token. The access token is sent to the client, while the refresh token is stored in the database (hashed) and sent as a cookie.
  const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken(user);


   // Store only the HASH of the refresh token
  await User.updateOne(
    { _id: user._id },
    { refreshTokenHash: hashToken(refreshToken) }
  );


  return { user, accessToken, refreshToken };
};



const refreshAccessToken = async (incomingToken) => {
  if (!incomingToken) {
    throw new ApiError(401, 'Refresh token missing. Please log in');
  }

  // 1. Verify the signature and expiry
  let decoded;
  try {
    decoded = verifyRefreshToken(incomingToken);
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired refresh token. Please log in again');
  }

  // 2. Load the user together with the stored hash
  const user = await User.findById(decoded.id).select('+refreshTokenHash');
  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid refresh token. Please log in again');
  }

  // 3. Compare with the hash in the database
  if (!user.refreshTokenHash || user.refreshTokenHash !== hashToken(incomingToken)) {
    // A valid-looking token that is NOT the current one means an OLD token
    // was used again: it may have been stolen. Revoke the session completely.
    if (user.refreshTokenHash) {
      await User.updateOne({ _id: user._id }, { $unset: { refreshTokenHash: 1 } });
      logger.warn(`Refresh token reuse detected for user ${user._id}`);
    }
    throw new ApiError(401, 'Invalid refresh token. Please log in again');
  }

  // 4. Rotation: issue new tokens and replace the stored hash
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await User.updateOne(
    { _id: user._id },
    { refreshTokenHash: hashToken(refreshToken) }
  );

  return { accessToken, refreshToken };
};

module.exports = { register, login, refreshAccessToken };

