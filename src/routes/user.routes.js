const express = require('express');
const { protect ,restrictTo} = require('../middlewares/auth.middleware');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', protect, userController.getMe);
// TEMPORARY: delete after testing
router.get('/admin-test', protect, restrictTo('admin'), (req, res) => {
  res.json({ success: true, message: `Welcome admin ${req.user.name}` });
});

module.exports = router;