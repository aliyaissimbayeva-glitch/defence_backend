const express = require('express');

const router = express.Router();

const {
  createBid,
  getBids,
  acceptBid,
  rejectBid,
  getListingBids
} = require('./bid.controller');

const {
  requireAuth
} = require('../../middleware/auth.middleware');

const {
  requireRole
} = require('../../middleware/role.middleware');

router.post(
  '/',
  requireAuth,
  requireRole('CONSUMER'),
  createBid
);

router.get(
  '/',
  requireAuth,
  getBids
);

router.patch(
  '/:id/accept',
  requireAuth,
  requireRole('RESTAURANT', 'ADMIN'),
  acceptBid
);

router.patch(
  '/:id/reject',
  requireAuth,
  requireRole('RESTAURANT', 'ADMIN'),
  rejectBid
);

router.get(
  '/listing/:id',
  requireAuth,
  getListingBids
);

module.exports = router;