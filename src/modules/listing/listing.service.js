const prisma = require('../../lib/prisma');

function getStatus(expiresAt) {
  const now = new Date();
  const diff = (new Date(expiresAt) - now) / 1000;

  if (diff > 3600) return 'FRESH';
  if (diff > 1800) return 'DISCOUNTED';
  if (diff > 0) return 'FREE';

  return 'COMPOST';
}

async function createListing(data, userId) {

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      userId
    }
  });

  if (!restaurant) {
    throw new Error('Restaurant profile not found');
  }

  const decayState = getStatus(data.expiresAt);

  return prisma.listing.create({
    data: {
      title: data.title,
      description: data.description,
      ingredients: data.ingredients,
      allergens: data.allergens,

      initialPrice: data.initialPrice,
      currentPrice: getPrice(
  data.initialPrice,
  data.expiresAt
),

      quantity: data.quantity,
      availableQty: data.quantity,

      expiryAt: data.expiresAt,

      decayState,

      restaurantId: restaurant.id
    }
  });
}

function getPrice(originalPrice, expiresAt) {
  const now = new Date();
  const diff = (new Date(expiresAt) - now) / 1000;

  if (diff > 3600) return originalPrice;
  if (diff > 1800) return originalPrice * 0.7;
  if (diff > 0) return originalPrice * 0.3;

  return 0;
}

module.exports = { createListing, getPrice, getStatus };