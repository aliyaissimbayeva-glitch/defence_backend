const banUser = async (req, res) => {
  const userId = req.params.id;

  res.json({
    message: 'User banned',
    userId
  });
};

const prisma = require('../../lib/prisma');

const getAuditLogs = async (req, res) => {
  try {

    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(logs);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
};
const getUsers = async (req, res) => {
  try {

    const users = await prisma.user.findMany();

    res.json(users);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
};
const overrideDecayState = async (req, res) => {
  try {

    const listingId = Number(req.params.id);

    const {
      decayState
    } = req.body;

    const listing = await prisma.listing.update({
      where: {
        id: listingId
      },

      data: {
        decayState
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,

        action: 'ADMIN_OVERRIDE',

        entityType: 'Listing',

        entityId: String(listingId)
      }
    });

    res.json(listing);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};
module.exports = { banUser, getAuditLogs, getUsers, overrideDecayState };