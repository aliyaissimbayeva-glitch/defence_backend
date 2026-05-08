const express = require('express');

const router = express.Router();

const {
  createDelivery,
  getDeliveries
} = require('./delivery.controller');

const {
  requireAuth
} = require('../../middleware/auth.middleware');

const {
  requireRole
} = require('../../middleware/role.middleware');

router.post(
  '/',
  requireAuth,
  requireRole('DRIVER', 'ADMIN'),
  createDelivery
);

router.get(
  '/',
  requireAuth,
  getDeliveries
);

module.exports = router;