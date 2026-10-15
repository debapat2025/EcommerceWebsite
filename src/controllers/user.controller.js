const asyncHandler = require('../utils/asyncHandler');
const userService = require('../services/user.service');
const { clearRefreshCookie } = require('../utils/cookie');

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Profile fetched',
    data: { user: req.user },
  });
});

const updateMe = asyncHandler(async (req, res) => {
    console.log('Request body:', req.body);
  console.log('Authenticated user ID:', req.user._id);
  const user = await userService.updateMe(req.user._id, req.body, req.file);

  res.status(200).json({
    success: true,
    message: 'Profile updated',
    data: { user },
  });
});


const deactivateMe = asyncHandler(async (req, res) => {
  await userService.deactivateMe(req.user._id, req.body.password);

  clearRefreshCookie(res); // remove the login cookie from the browser

  res.status(200).json({
    success: true,
    message: 'Your account has been deactivated',
  });
});



//address
const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await userService.getAddresses(req.user._id);
  res.status(200).json({ success: true, message: 'Addresses fetched', data: { addresses } });
});

const addAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.addAddress(req.user._id, req.body);
  res.status(201).json({ success: true, message: 'Address added', data: { addresses } });
});


const updateAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.updateAddress(req.user._id, req.params.addressId, req.body);
  res.status(200).json({ success: true, message: 'Address updated', data: { addresses } });
});

const deleteAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.deleteAddress(req.user._id, req.params.addressId);
  res.status(200).json({ success: true, message: 'Address deleted', data: { addresses } });
});

const setDefaultAddress = asyncHandler(async (req, res) => {
  const addresses = await userService.setDefaultAddress(req.user._id, req.params.addressId);
  res.status(200).json({ success: true, message: 'Default address updated', data: { addresses } });

});

const getUsers = asyncHandler(async (req, res) => {
  const { users, meta } = await userService.getUsers(req.query);

  res.status(200).json({
    success: true,
    message: 'Users fetched',
    data: { users },
    meta,                 // total, page, limit, totalPages, ...
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: 'User fetched',
    data: { user },
  });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.user, req.params.id, req.body.role);

  res.status(200).json({
    success: true,
    message: 'User role updated',
    data: { user },
  });
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.user, req.params.id, req.body.isActive);

  res.status(200).json({
    success: true,
    message: req.body.isActive ? 'User unblocked' : 'User blocked',
    data: { user },
  });
});
module.exports = { getMe, updateMe, deactivateMe, getAddresses, addAddress, updateAddress, setDefaultAddress ,deleteAddress, getUsers, getUserById , updateUserRole , updateUserStatus};
