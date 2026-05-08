const prisma = require('../../lib/prisma');

const createRestaurant = async (req, res) => {
  try {

    const existing = await prisma.restaurant.findUnique({
      where: {
        userId: req.user.userId
      }
    });

    if (existing) {
      return res.status(409).json({
        error: 'Restaurant already exists'
      });
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        userId: req.user.userId,

        name: req.body.name,

        address: req.body.address,

        lat: req.body.lat,

        lng: req.body.lng
      }
    });

    res.status(201).json(restaurant);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

const getRestaurants = async (req, res) => {
  try {

    const restaurants = await prisma.restaurant.findMany({
      include: {
        listings: true
      }
    });

    res.json(restaurants);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  createRestaurant,
  getRestaurants
};