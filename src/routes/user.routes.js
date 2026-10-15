const express = require('express');
const { protect ,restrictTo} = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');
const { uploadAvatar } = require('../middlewares/upload.middleware');
const router = express.Router();
const commonValidator = require('../validators/common.validator');

router.get('/me', protect, userController.getMe);
// router.patch('/me', protect, validate(userValidator.updateMe), userController.updateMe);
router.patch(
  '/me',
  protect,        // 1. logged in?
  uploadAvatar,   // 2. read the optional picture (and the text fields)
  validate(userValidator.updateMe), // 3. check name and phone
  userController.updateMe
);
router.delete('/me', protect, validate(userValidator.deactivateMe), userController.deactivateMe);

router.get('/me/addresses', protect, userController.getAddresses);

router.post(
  '/me/addresses',
  protect,
  validate(userValidator.address),
  userController.addAddress
);

router.put(
  '/me/addresses/:addressId',
  protect,
  validate({ ...commonValidator.idParams('addressId'), ...userValidator.address }),
  userController.updateAddress
);


router.delete(
  '/me/addresses/:addressId',
  protect,
  validate(commonValidator.idParams('addressId')),
  userController.deleteAddress
);


router.patch(
  '/me/addresses/:addressId/default',
  protect,
  validate(commonValidator.idParams('addressId')),
  userController.setDefaultAddress
);

router.get(
  '/',
  protect,
  restrictTo('admin', 'superadmin'),
  validate(userValidator.listUsers),
  userController.getUsers
);

router.get(
  '/:id',
  protect,
  restrictTo('admin', 'superadmin'),
  validate(commonValidator.idParam),
  userController.getUserById
);

// Only the main admin can create or remove sub-admins
router.patch(
  '/:id/role',
  protect,
  restrictTo('superadmin'),
  validate({ ...commonValidator.idParam, ...userValidator.updateRole }),
  userController.updateUserRole
);

// Sub-admins may block normal users. The service blocks them from touching other admins
router.patch(
  '/:id/status',
  protect,
  restrictTo('admin', 'superadmin'),
  validate({ ...commonValidator.idParam, ...userValidator.updateStatus }),
  userController.updateUserStatus
);

module.exports = router;