const prisma = require('../../lib/prisma');

const createOrderController = async (req, res) => {
  try {
    const { listingId, quantity } = req.body;

    if (!listingId || !quantity) {
      return res.status(400).json({
        error: 'Missing fields'
      });
    }

    const result = await prisma.$transaction(async (tx) => {

      // 1. Find listing
      const listing = await tx.listing.findUnique({
        where: {
          id: listingId
        }
      });

      if (!listing) {
        throw new Error('Listing not found');
      }

      // 2. Expiration check
      if (listing.decayState === 'COMPOST') {
        throw new Error('Item expired');
      }

      // 3. Quantity check
      if (listing.availableQty < quantity) {
        throw new Error('Not enough stock');
      }

      // 4. User allergy check
      const user = await tx.user.findUnique({
        where: {
          id: req.user.userId
        }
      });

      const hasAllergy = listing.allergens.some(a =>
        user.allergies.includes(a)
      );

      if (hasAllergy) {
        throw new Error('Allergy conflict');
      }

      // 5. Update stock
      await tx.listing.update({
        where: {
          id: listingId
        },
        data: {
          availableQty: listing.availableQty - quantity
        }
      });

      // 6. Create order
      const order = await tx.order.create({
        data: {
          consumerId: req.user.userId,

          totalAmount:
            Number(listing.currentPrice) * quantity,

          status: 'PENDING'
        }
      });

      // 7. Create order item
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          listingId: listing.id,

          quantity,

          unitPrice: listing.currentPrice
        }
      });

      // 8. Audit log
      await tx.auditLog.create({
        data: {
          actorId: req.user.userId,

          action: 'ORDER_CREATED',

          entityType: 'Order',

          entityId: String(order.id)
        }
      });

      return order;
    });

    res.status(201).json(result);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};
await emailQueue.add(

  'order-created',

  {
    email: user.email,
    orderId: order.id
  },

  {
    attempts: 3
  }
);
const updateStatus = async (req, res) => {
  try {

    const orderId = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status
      }
    });

    res.json(order);

  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
};const refundOrder = async (req, res) => {
  try {

    const orderId = Number(req.params.id);

    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      }
    });

    if (!order) {
      return res.status(404).json({
        error: 'Order not found'
      });
    }

    if (order.status === 'REFUNDED') {
      return res.status(400).json({
        error: 'Order already refunded'
      });
    }

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },

      data: {
        status: 'REFUNDED'
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,

        action: 'ORDER_REFUNDED',

        entityType: 'Order',

        entityId: String(orderId)
      }
    });

    res.json(updatedOrder);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

module.exports = {
  createOrderController,
  updateStatus,
  refundOrder
};