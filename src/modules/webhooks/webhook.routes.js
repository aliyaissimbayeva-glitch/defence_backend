const express = require('express');

const router = express.Router();

const {
  kaspiWebhook
} = require('./webhook.controller');

router.post(
  '/kaspi',
  kaspiWebhook
);

module.exports = router;