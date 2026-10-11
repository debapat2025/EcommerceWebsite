const express = require('express');
const { protect ,restrictTo} = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');
const { uploadAvatar } = require('../middlewares/upload.middleware');
const router = express.Router();

router.get('/me', protect, userController.getMe);
// router.patch('/me', protect, validate(userValidator.updateMe), userController.updateMe);
router.patch(
  '/me',
  protect,        // 1. logged in?
  uploadAvatar,   // 2. read the optional picture (and the text fields)
  validate(userValidator.updateMe), // 3. check name and phone
  userController.updateMe
);


module.exports = router;