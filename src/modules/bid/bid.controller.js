const prisma = require('../../lib/prisma');

const createBid = async (req, res) => {
  try {

    const {
      listingId,
      feeOffer
    } = req.body;

    const bid = await prisma.auctionBid.create({
      data: {
        listingId,

        bidderId: req.user.userId,

        feeOffer
      }
    });

    res.status(201).json(bid);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

const getBids = async (req, res) => {
  try {

    const bids = await prisma.auctionBid.findMany({
      include: {
        bidder: true,
        listing: true
      }
    });

    res.json(bids);

  } catch (err) {

    res.status(500).json({
      error: err.message
    });
  }
};

module.exports = {
  createBid,
  getBids
};