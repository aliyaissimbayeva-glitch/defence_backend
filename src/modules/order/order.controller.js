const prisma = require('../../lib/prisma');
const { emailQueue } = require('../../queues/email.queue');

const createOrderController = async (req, res) => {
  try {
    const { listingId, quantity } = req.body;

    if (!listingId || !quantity) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const result = await prisma.$transaction(async (tx) => {

      const listing = await tx.listing.findUnique({ where: { id: listingId } });
      if (!listing)                        throw new Error('Listing not found');
      const getLiveDecayState = (expiryAt) => {
        const diff = (new Date(expiryAt) - new Date()) / 1000;
        if (diff > 3600) return 'FRESH';
        if (diff > 1800) return 'DISCOUNTED';
        if (diff > 0)    return 'FREE';
        return 'COMPOST';
      };
      const liveState = getLiveDecayState(listing.expiryAt);

      if (liveState === 'COMPOST') throw new Error('Item expired');
      if (listing.availableQty < quantity) throw new Error('Not enough stock');

      if (req.user.role === 'SHELTER' &&
          liveState !== 'FREE' &&
          liveState !== 'DISCOUNTED') {
        throw new Error('Shelters can only order FREE or DISCOUNTED items');
      }

      const user = await tx.user.findUnique({ where: { id: req.user.userId } });

      const hasAllergy = listing.allergens.some(a => user.allergens.includes(a));
      if (hasAllergy) throw new Error('Allergy conflict');

      // Resolve consumerId / shelterId correctly
      let consumerId = null;
      let shelterId  = null;

      if (req.user.role === 'CONSUMER') {
        consumerId = req.user.userId;
      } else if (req.user.role === 'SHELTER') {
        const shelter = await tx.shelter.findUnique({
          where: { userId: req.user.userId }
        });
        if (!shelter) throw new Error('Shelter profile not found. Please set up your shelter first.');
        shelterId = shelter.id;
      }

      // Update stock
      await tx.listing.update({
        where: { id: listingId },
        data:  { availableQty: listing.availableQty - quantity }
      });

      const order = await tx.order.create({
        data: {
          consumerId,
          shelterId,
          restaurantId: listing.restaurantId,
          totalAmount: liveState === 'FREE' ? 0 : (
            liveState === 'DISCOUNTED'
              ? Number(listing.initialPrice) * 0.7
              : Number(listing.initialPrice)
          ) * quantity,
          status: 'PENDING'
        }
      });

      const liveUnitPrice = liveState === 'FREE' ? 0 : (
        liveState === 'DISCOUNTED'
          ? Number(listing.initialPrice) * 0.7
          : Number(listing.initialPrice)
      );

      await tx.orderItem.create({
        data: {
          orderId:   order.id,
          listingId: listing.id,
          quantity,
          unitPrice: liveUnitPrice
        }
      });

      await tx.auditLog.create({
        data: {
          actorId:    req.user.userId,
          action:     'ORDER_CREATED',
          entityType: 'Order',
          entityId:   String(order.id)
        }
      });

      await emailQueue.add(
        'order-created',
        { email: user.email, orderId: order.id },
        { attempts: 3 }
      );

      return order;
    });

    res.status(201).json(result);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;
    const order = await prisma.order.update({
      where: { id: orderId },
      data:  { status }
    });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const refundOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order)                    return res.status(404).json({ error: 'Order not found' });
    if (order.status === 'REFUNDED') return res.status(400).json({ error: 'Already refunded' });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data:  { status: 'REFUNDED' }
    });

    await prisma.auditLog.create({
      data: {
        actorId:    req.user.userId,
        action:     'ORDER_REFUNDED',
        entityType: 'Order',
        entityId:   String(orderId)
      }
    });

    res.json(updatedOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createOrderController, updateStatus, refundOrder };