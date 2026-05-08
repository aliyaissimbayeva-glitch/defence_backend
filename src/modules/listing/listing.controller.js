const { createListing } = require('./listing.service');
const prisma = require('../../lib/prisma');

async function createListingController(req, res) {
  try {
    const listing = await createListing(req.body, req.user.userId);
    res.status(201).json(listing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}


const updateDecayState = async (req, res) => {
  try {

    const listingId = Number(req.params.id);

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId
      }
    });

    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

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

    const updatedListing =
      await prisma.listing.update({
        where: {
          id: listingId
        },

        data: {
          decayState,
          currentPrice
        }
      });

    res.json(updatedListing);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};
const getListingById = async (req, res) => {
  try {

    const listing = await prisma.listing.findUnique({
      where: {
        id: Number(req.params.id)
      },

      include: {
        restaurant: true,
        bids: true,
        orderItems: true
      }
    });

    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    res.json(listing);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

const deleteListing = async (req, res) => {
  try {

    const listingId = Number(req.params.id);

    const listing = await prisma.listing.update({
      where: {
        id: listingId
      },

      data: {
        isActive: false
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,

        action: 'LISTING_CANCELLED',

        entityType: 'Listing',

        entityId: String(listing.id)
      }
    });

    res.json({
      message: 'Listing cancelled',
      listing
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};
const getListings = async (req, res) => {

  try {

    const {
      cursor,
      limit = 10
    } = req.query;

    const listings =
      await prisma.listing.findMany({

        take: Number(limit),

        skip: cursor ? 1 : 0,

        cursor: cursor
          ? {
              id: Number(cursor)
            }
          : undefined,

        where: {
          isActive: true
        },

        orderBy: {
          id: 'asc'
        },

        include: {
          restaurant: true
        }
      });

    res.json(listings);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};module.exports = {
  createListingController,
  updateDecayState,
  getListings,
  getListingById,
  deleteListing
};