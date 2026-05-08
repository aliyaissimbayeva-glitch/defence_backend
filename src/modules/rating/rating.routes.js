const express = require('express');

const router = express.Router();

const {
  createRating,
  getRatings
} = require('./rating.controller');

const {
  requireAuth
} = require('../../middleware/auth.middleware');

router.post(
  '/',
  requireAuth,
  createRating
);

router.get(
  '/',
  requireAuth,
  getRatings
);

module.exports = router;