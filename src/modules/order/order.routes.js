const express = require('express');
const router = express.Router();

const prisma = require('../../lib/prisma');

const {
  createOrderController,
  updateStatus,
  refundOrder
} = require('./order.controller');

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
  createOrderController
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole('DRIVER'),
  updateStatus
);

router.get(
  '/',
  requireAuth,
  async (req, res) => {

    const orders = await prisma.order.findMany({
      include: {
        items: true
      }
    });

    res.json(orders);
  }
);

router.get(
  '/:id',
  requireAuth,
  async (req, res) => {

    const order = await prisma.order.findUnique({
      where: {
        id: Number(req.params.id)
      },

      include: {
        items: true,
        delivery: true
      }
    });

    res.json(order);
  }
);
router.post(
  '/:id/refund',
  requireAuth,
  refundOrder
);
module.exports = router;