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

module.exports = router;