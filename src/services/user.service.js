const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');

const updateMe = async (userId, data) => {
  // Take ONLY name and phone. Nothing else can ever be changed here
  const updates = {};
//   if (data.name) updates.name = data.name;
//   if (data.phone) updates.phone = data.phone;

 if (data.name !== undefined) updates.name = data.name;
  if (data.phone !== undefined) updates.phone = data.phone;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'Please provide name or phone to update');
  }


  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,           // give me the UPDATED user back
    runValidators: true, // check the model rules (like the phone pattern)
  });

  if (!user) throw new ApiError(404, 'User not found');

  return user;
};

module.exports = { updateMe };