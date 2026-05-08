const express = require('express');
const router = express.Router();

const { updateStatus } = require('./driver.controller');
const { requireAuth } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const {
  createDriver,
  getDrivers
} = require('./driver.controller');
router.patch(
  '/:id/status',
  requireAuth,
  requireRole('DRIVER'),
  updateStatus
);

router.post(
  '/',
  requireAuth,
  requireRole('DRIVER'),
  createDriver
);

router.get(
  '/',
  requireAuth,
  getDrivers
);
module.exports = router;