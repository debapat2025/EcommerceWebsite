const express = require('express');
const { protect ,restrictTo} = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');
const validate = require('../middlewares/validate.middleware');
const userValidator = require('../validators/user.validator');

const router = express.Router();

router.get('/me', protect, userController.getMe);
router.patch('/me', protect, validate(userValidator.updateMe), userController.updateMe);


module.exports = router;