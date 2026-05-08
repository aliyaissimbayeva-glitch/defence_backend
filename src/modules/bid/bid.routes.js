const express = require('express');

const router = express.Router();

const {
  createBid,
  getBids
} = require('./bid.controller');

const {
  requireAuth
} = require('../../middleware/auth.middleware');

router.post(
  '/',
  requireAuth,
  createBid
);

router.get(
  '/',
  requireAuth,
  getBids
);

module.exports = router;