const prisma = require('../../lib/prisma');

const createDelivery = async (req, res) => {
  try {

    const {
      orderId,
      shelterId
    } = req.body;

    const delivery = await prisma.delivery.create({
      data: {
        orderId,
        shelterId
      }
    });

    res.status(201).json(delivery);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

const getDeliveries = async (req, res) => {
  try {

    const deliveries = await prisma.delivery.findMany({
      include: {
        order: true,
        shelter: true
      }
    });

    res.json(deliveries);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  createDelivery,
  getDeliveries
};