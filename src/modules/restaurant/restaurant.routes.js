const express = require('express');

const router = express.Router();

const prisma = require('../../lib/prisma');

const {
  createRestaurant,
  getRestaurants
} = require('./restaurant.controller');

const {
  requireAuth
} = require('../../middleware/auth.middleware');

const {
  requireRole
} = require('../../middleware/role.middleware');

router.post(
  '/',
  requireAuth,
  requireRole('RESTAURANT'),
  createRestaurant
);

router.get(
  '/',
  getRestaurants
);

module.exports = router;