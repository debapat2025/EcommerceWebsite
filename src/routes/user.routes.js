const express = require('express');
const { protect ,restrictTo} = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', protect, userController.getMe);


module.exports = router;