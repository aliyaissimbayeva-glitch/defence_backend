const prisma = require('../../lib/prisma');

async function updateDecayStates() {

  const listings = await prisma.listing.findMany();

  for (const listing of listings) {

    const now = new Date();

    const diff =
      (new Date(listing.expiryAt) - now) / 1000;

    let decayState;
    let currentPrice;

    if (diff > 3600) {
      decayState = 'FRESH';
      currentPrice = listing.initialPrice;
    }

    else if (diff > 1800) {
      decayState = 'DISCOUNTED';
      currentPrice =
        Number(listing.initialPrice) * 0.7;
    }

    else if (diff > 0) {
      decayState = 'FREE';
      currentPrice = 0;
    }

    else {
      decayState = 'COMPOST';
      currentPrice = 0;
    }

    await prisma.listing.update({
      where: {
        id: listing.id
      },

      data: {
        decayState,
        currentPrice
      }
    });
  }

  console.log('Decay states updated');
}

module.exports = {
  updateDecayStates
};