const express = require('express');

const router = express.Router();

const {
  createShelter,
  getShelters
} = require('./shelter.controller');

const {
  requireAuth
} = require('../../middleware/auth.middleware');

const {
  requireRole
} = require('../../middleware/role.middleware');

router.post(
  '/',
  requireAuth,
  requireRole('SHELTER'),
  createShelter
);

router.get(
  '/',
  requireAuth,
  getShelters
);

module.exports = router;