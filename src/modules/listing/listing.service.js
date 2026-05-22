const prisma = require('../../lib/prisma');

function normalizeExpiry(expiryAt) {

  const expiry = new Date(
    expiryAt
  );

  expiry.setHours(
    expiry.getHours() + 5
  );

  return expiry;

}

function getStatus(expiryAt) {

  const now = new Date();

  const expiry =
    normalizeExpiry(
      expiryAt
    );

  const diff =
    (expiry - now) / 1000;

  if (diff > 3600)
    return 'FRESH';

  if (diff > 1800)
    return 'DISCOUNTED';

  if (diff > 0)
    return 'FREE';

  return 'COMPOST';

}

function getPrice(
  originalPrice,
  expiryAt
) {

  const now = new Date();

  const expiry =
    normalizeExpiry(
      expiryAt
    );

  const diff =
    (expiry - now) / 1000;

  if (diff > 3600)
    return originalPrice;

  if (diff > 1800)
    return originalPrice * 0.7;

  if (diff > 0)
    return originalPrice * 0.3;

  return 0;

}

async function createListing(
  data,
  userId
) {

  const restaurant =
    await prisma.restaurant.findUnique({

      where: {
        userId
      }

    });

  if (!restaurant) {

    throw new Error(
      'Restaurant profile not found'
    );

  }

  return prisma.listing.create({

    data: {

      title:
        data.title,

      description:
        data.description,

      ingredients:
        data.ingredients,

      allergens:
        data.allergens,

      initialPrice:
        data.initialPrice,

      currentPrice:

        getPrice(

          data.initialPrice,

          data.expiryAt

        ),

      quantity:
        data.quantity,

      availableQty:
        data.quantity,

      expiryAt:
        new Date(
          data.expiryAt
        ),

      decayState:

        getStatus(
          data.expiryAt
        ),

      restaurantId:
        restaurant.id

    }

  });

}

module.exports = {

  createListing,

  getPrice,

  getStatus

};