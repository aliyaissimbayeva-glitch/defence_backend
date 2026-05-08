const prisma = require('../../lib/prisma');

async function createOrder(userId, listingId, quantity) {

  return prisma.$transaction(async (tx) => {

    // 1. Find listing
    const listing = await tx.listing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!listing) {
      throw new Error('Listing not found');
    }

    // 2. Find user
    const user = await tx.user.findUnique({
      where: {
        id: userId
      }
    });

    // 3. Allergy validation
    const hasAllergy = listing.allergens.some(a =>
      user.allergies.includes(a)
    );

    if (hasAllergy) {
      throw new Error('Allergy conflict');
    }

    // 4. Expiration check
    if (listing.decayState === 'COMPOST') {
      throw new Error('Item expired');
    }

    // 5. Stock check
    if (listing.availableQty < quantity) {
      throw new Error('Not enough stock');
    }

    // 6. Update stock
    await tx.listing.update({
      where: {
        id: listingId
      },

      data: {
        availableQty:
          listing.availableQty - quantity
      }
    });

    // 7. Create order
    const order = await tx.order.create({
      data: {
        consumerId: userId,

        totalAmount:
          Number(listing.currentPrice) * quantity,

        status: 'PENDING'
      }
    });

    // 8. Create order item
    await tx.orderItem.create({
      data: {
        orderId: order.id,

        listingId: listing.id,

        quantity,

        unitPrice: listing.currentPrice
      }
    });

    // 9. Audit log
    await tx.auditLog.create({
      data: {
        actorId: userId,

        action: 'ORDER_CREATED',

        entityType: 'Order',

        entityId: String(order.id)
      }
    });

    return order;
  });
}

module.exports = { createOrder };