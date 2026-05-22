const prisma = require('../../lib/prisma');

const createRating = async (req, res) => {
  try {
    const { orderId, stars, comment } = req.body;

    const rating = await prisma.rating.create({
      data: {
        orderId,
        raterId: req.user.userId,
        stars,
        comment
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'RATING_CREATED',
        entityType: 'Rating',
        entityId: String(rating.id)
      }
    });

    res.status(201).json(rating);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getRatings = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      include: {
        order: true,
        rater: true
      }
    });

    res.json(ratings);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRating,
  getRatings
};