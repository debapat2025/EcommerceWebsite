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





const deactivateMe = async (userId, password) => {
  // The password has select:false, so we must ask for it
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  // 1. Is the password correct?
  if (!(await user.comparePassword(password))) {
    throw new ApiError(400, 'Password is incorrect');
  }

  // 2. Do not let the LAST admin switch themselves off
  if (user.role === 'admin') {
    const otherAdmins = await User.countDocuments({
      role: 'admin',
      isActive: true,
      _id: { $ne: user._id },   // "$ne" means "not equal": count admins other than me
    });

    if (otherAdmins === 0) {
      throw new ApiError(400, 'You are the only active admin. Make another user an admin first');
    }
  }

  // 3. Switch the account off and remove the refresh token
  await User.updateOne(
    { _id: user._id },
    { $set: { isActive: false }, $unset: { refreshTokenHash: 1 } }
  );
};



// now it is for usser addresses
const MAX_ADDRESSES = 5;
// Load the user, or stop with a 404
const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  return user;
};


const getAddresses = async (userId) => {
  const user = await getUser(userId);
  return user.addresses;
};




const addAddress = async (userId, data) => {
  const user = await getUser(userId);

  if (user.addresses.length >= MAX_ADDRESSES) {
    throw new ApiError(400, `You can save up to ${MAX_ADDRESSES} addresses`);
  }

  // The first address is always the default. Otherwise only if the user asked for it
  const makeDefault = user.addresses.length === 0 || data.isDefault === true;

  if (makeDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; }); // only one default allowed
  }

  user.addresses.push({ ...data, isDefault: makeDefault });
  await user.save();

  return user.addresses;
};



const updateAddress = async (userId, addressId, data) => {
  const user = await getUser(userId);

  const address = user.addresses.id(addressId); // find one address inside the list
  if (!address) throw new ApiError(404, 'Address not found');

  const { isDefault, ...fields } = data;
  address.set(fields); // update the fields that were sent

  if (isDefault === true) {
    user.addresses.forEach((a) => { a.isDefault = false; });
    address.isDefault = true;
  }

  await user.save();
  return user.addresses;
};


const deleteAddress = async (userId, addressId) => {
  const user = await getUser(userId);

  const address = user.addresses.id(addressId);
  if (!address) throw new ApiError(404, 'Address not found');

  const wasDefault = address.isDefault;
  user.addresses.pull(addressId); // remove it from the list

  // If we deleted the default, make the first remaining address the default
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();
  return user.addresses;
};


const setDefaultAddress = async (userId, addressId) => {
  const user = await getUser(userId);

  const address = user.addresses.id(addressId); // the address the user chose
  if (!address) throw new ApiError(404, 'Address not found');

  // Step 1: set ALL addresses to false
  user.addresses.forEach((a) => {
    a.isDefault = false;
  });

  // Step 2: set the chosen one to true
  address.isDefault = true;

  await user.save();
  return user.addresses;
};

module.exports = { updateMe, deactivateMe, getUser, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress };