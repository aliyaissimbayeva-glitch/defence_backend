const prisma = require('../../lib/prisma');

const updateStatus = async (req, res) => {
  try {
    const orderId = Number(req.params.id);
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'ORDER_STATUS_UPDATED',
        entityType: 'Order',
        entityId: String(orderId)
      }
    });

    res.json(order);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const pickupOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PICKED_UP' }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'ORDER_PICKED_UP',
        entityType: 'Order',
        entityId: String(orderId)
      }
    });

    res.json(order);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const orderId = Number(req.params.id);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'DELIVERED' }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'ORDER_DELIVERED',
        entityType: 'Order',
        entityId: String(orderId)
      }
    });

    res.json(order);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createDriver = async (req, res) => {
  try {
    const existing = await prisma.driver.findFirst({
      where: { userId: req.user.userId }
    });

    if (existing) {
      return res.status(409).json({ error: 'Driver already exists' });
    }

    const driver = await prisma.driver.create({
      data: {
        userId: req.user.userId,
        vehicleType: req.body.vehicleType,
        licensePlate: req.body.licensePlate
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'DRIVER_CREATED',
        entityType: 'Driver',
        entityId: String(driver.id)
      }
    });

    res.status(201).json(driver);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: { routes: true }
    });

    res.json(drivers);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  updateStatus,
  pickupOrder,
  deliverOrder,
  createDriver,
  getDrivers
};