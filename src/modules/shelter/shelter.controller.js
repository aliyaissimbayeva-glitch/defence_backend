const prisma = require('../../lib/prisma');

const createShelter = async (req, res) => {
  try {

    const existing = await prisma.shelter.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (existing) {
      return res.status(409).json({
        error: 'Shelter already exists'
      });
    }

    const shelter = await prisma.shelter.create({
      data: {
        userId: req.user.userId,

        name: req.body.name,

        address: req.body.address
      }
    });

    res.status(201).json(shelter);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

const getShelters = async (req, res) => {
  try {

    const shelters = await prisma.shelter.findMany({
      include: {
        deliveries: true
      }
    });

    res.json(shelters);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  createShelter,
  getShelters
};