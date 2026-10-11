// const User = require('../models/user.model');
// const ApiError = require('../utils/ApiError');

// const updateMe = async (userId, data) => {
//   // Take ONLY name and phone. Nothing else can ever be changed here
//   const updates = {};
// //   if (data.name) updates.name = data.name;
// //   if (data.phone) updates.phone = data.phone;

//  if (data.name !== undefined) updates.name = data.name;
//   if (data.phone !== undefined) updates.phone = data.phone;

//   if (Object.keys(updates).length === 0) {
//     throw new ApiError(400, 'Please provide name or phone to update');
//   }


//   const user = await User.findByIdAndUpdate(userId, updates, {
//     new: true,           // give me the UPDATED user back
//     runValidators: true, // check the model rules (like the phone pattern)
//   });

//   if (!user) throw new ApiError(404, 'User not found');

//   return user;
// };

// module.exports = { updateMe };




const path = require('path');
const fs = require('fs');
const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { uploadDir } = require('../middlewares/upload.middleware');

// Delete a picture from the folder using the path saved in the database
const deleteOldAvatar = (avatarPath) => {
  if (!avatarPath) return;
  // path.basename keeps only the file name, so nobody can point us to another folder
  const filePath = path.join(uploadDir, path.basename(avatarPath));
  fs.unlink(filePath, () => {}); // if the file is already gone, ignore it
};

const updateMe = async (userId, data = {}, file) => {
  const updates = {};
  if (data.name) updates.name = data.name;
  if (data.phone) updates.phone = data.phone;
  //if (file) updates.avatar = `/uploads/avatars/${file.filename}`;
  if (file) updates.avatar = file.filename;

  if (Object.keys(updates).length === 0) {
    throw new ApiError(400, 'Provide at least one field to update: name, phone or avatar image');
  }

  const oldUser = await User.findById(userId); // we need the old picture name
  if (!oldUser) {
    if (file) fs.unlink(file.path, () => {});
    throw new ApiError(404, 'User not found');
  }

  const user = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  // The new data is saved, so now delete the OLD picture (only if a new one came)
  if (file) deleteOldAvatar(oldUser.avatar);

  return user;
};

module.exports = { updateMe };