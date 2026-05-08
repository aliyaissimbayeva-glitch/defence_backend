const prisma = require('../../lib/prisma');

const kaspiWebhook = async (req, res) => {
  try {

    const {
      orderId,
      status
    } = req.body;

    if (status === 'PAID') {

      await prisma.order.update({
        where: {
          id: orderId
        },

        data: {
          status: 'CONFIRMED'
        }
      });

      await prisma.auditLog.create({
        data: {
          action: 'ORDER_PLACED',

          entityType: 'Order',

          entityId: String(orderId)
        }
      });
    }

    res.json({
      received: true
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

module.exports = {
  kaspiWebhook
};