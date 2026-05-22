const express = require('express');
const router = express.Router();

const prisma = require('../../lib/prisma');

const {
  createOrderController,
  updateStatus,
  refundOrder
} = require('./order.controller');

const { requireAuth } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');

router.post(
  '/',
  requireAuth,
  requireRole('CONSUMER', 'SHELTER'),
  createOrderController
);

router.patch(
  '/:id/status',
  requireAuth,
  requireRole('DRIVER'),
  updateStatus
);

router.patch(
  '/:id/confirm',
  requireAuth,
  requireRole('RESTAURANT'),
  async (req, res) => {
    try {
      const order = await prisma.order.update({
        where: { id: Number(req.params.id) },
        data:  { status: 'CONFIRMED' }
      });
      res.json(order);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);
router.post(

"/:id/take",

requireAuth,
requireRole(
"DRIVER"
),

async(req,res)=>{

const orderId=
Number(
req.params.id
);

const existing=

await prisma.delivery.findUnique({

where:{
orderId
}

});

if(existing){

return res.status(400).json({

error:
"Already assigned"

});

}

await prisma.delivery.create({

data:{

orderId,

driverId:
req.user.userId

}

});

const order=

await prisma.order.update({

where:{
id:orderId
},

data:{

status:
"DRIVER_ASSIGNED"

}

});

res.json(order);

}
);

router.get(
  '/',
  requireAuth,
  async (req, res) => {
    try {
      let orders = [];

      if (req.user.role === 'CONSUMER') {

        orders = await prisma.order.findMany({
          where: { consumerId: req.user.userId },
          include: {
            items: { include: { listing: true } },
            delivery: true
          }
        });

      } else if (req.user.role === 'SHELTER') {

        const shelter = await prisma.shelter.findUnique({
          where: { userId: req.user.userId }
        });

        orders = shelter ? await prisma.order.findMany({
          where: { shelterId: shelter.id },
          include: {
            items: { include: { listing: true } },
            delivery: true
          }
        }) : [];

      } else if (req.user.role === 'RESTAURANT') {

        const restaurant = await prisma.restaurant.findUnique({
          where: { userId: req.user.userId }
        });

        if (!restaurant) {
          return res.json([]);
        }

        orders = await prisma.order.findMany({
          where: { restaurantId: restaurant.id },
          include: {
            items: { include: { listing: true } },
            delivery: true
          },
          orderBy: { createdAt: 'desc' }
        });

      } else if (req.user.role === 'DRIVER') {

        const all = await prisma.order.findMany({
          include: {
            items: { include: { listing: true } },
            delivery: true
          }
        });

        // Show CONFIRMED (available to take) + own assigned orders
        orders = all.filter(
          o => o.status === 'CONFIRMED' || o.delivery?.driverId === req.user.userId
        );

      } else {

        orders = await prisma.order.findMany({
          include: {
            items: { include: { listing: true } },
            delivery: true
          }
        });

      }

      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

router.get(
  '/:id',
  requireAuth,
  async (req, res) => {
    const order = await prisma.order.findUnique({
      where: { id: Number(req.params.id) },
      include: { items: true, delivery: true }
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