const express = require('express');

const router = express.Router();

const {
  requireAuth
} = require('../../middleware/auth.middleware');

const {
  requireRole
} = require('../../middleware/role.middleware');

const {
  banUser,
  getUsers,
  getAuditLogs,
  overrideDecayState
} = require('./admin.controller');

router.get(
  '/users',
  requireAuth,
  requireRole('ADMIN'),
  getUsers
);

router.post(
  '/users/:id/ban',
  requireAuth,
  requireRole('ADMIN'),
  banUser
);

router.patch(
  '/listings/:id/decay-override',
  requireAuth,
  requireRole('ADMIN'),
  overrideDecayState
);

router.get(
  '/audit-logs',
  requireAuth,
  requireRole('ADMIN'),
  getAuditLogs
);

module.exports = router;