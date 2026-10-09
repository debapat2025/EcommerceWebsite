const express = require('express');
const validate = require('../middlewares/validate.middleware');
const authValidator = require('../validators/auth.validator');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  loginLimiter, emailLimiter, registerLimiter,
} = require('../middlewares/rateLimit.middleware');

const router = express.Router();

// TEMPORARY handlers: we will replace them with real controllers next
// router.post('/register', validate(authValidator.register), (req, res) => {
//   res.json({ success: true, message: 'Validation passed', data: req.body });
// });

router.post('/register', registerLimiter, validate(authValidator.register), authController.register);
router.post('/login', loginLimiter, validate(authValidator.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.patch(
  '/change-password',
  protect,
  validate(authValidator.changePassword),
  authController.changePassword
);

// router.post('/login', validate(authValidator.login), (req, res) => {
//   res.json({ success: true, message: 'Validation passed', data: req.body });
// });

router.get('/verify-email/:token', validate(authValidator.verifyEmail), authController.verifyEmail);
router.post(
  '/resend-verification',
  emailLimiter,
  validate(authValidator.resendVerification),
  authController.resendVerification
);


router.post(
  '/forgot-password', emailLimiter,
  validate(authValidator.forgotPassword),
  authController.forgotPassword
);
router.patch(
  '/reset-password/:token',
  validate(authValidator.resetPassword),
  authController.resetPassword
);
module.exports = router;