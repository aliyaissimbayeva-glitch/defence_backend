const express = require('express');

const router = express.Router();

const {
  requireAuth
} = require('../../middleware/auth.middleware');

const {
  authLimiter
} = require('../../middleware/rateLimit.middleware');

const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  verifyEmail,
  forgotPasswordController,
  resetPasswordController
} = require('./auth.controller');

router.post(
  '/register',
  authLimiter,
  registerController
);

router.post(
  '/login',
  authLimiter,
  loginController
);

router.post(
  '/refresh',
  authLimiter,
  refreshController
);

router.post(
  '/logout',
  requireAuth,
  logoutController
);

router.post(
  '/verify-email',
  verifyEmail
);

router.post(
  '/forgot-password',
  authLimiter,
  forgotPasswordController
);

router.post(
  '/reset-password',
  authLimiter,
  resetPasswordController
);

module.exports = router;