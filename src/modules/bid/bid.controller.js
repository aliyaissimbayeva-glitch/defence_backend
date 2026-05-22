const prisma = require('../../lib/prisma');

const createBid = async (req, res) => {
  try {
    const { listingId, feeOffer } = req.body;

    const bid = await prisma.auctionBid.create({
      data: {
        listingId,
        bidderId: req.user.userId,
        feeOffer
      }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'BID_CREATED',
        entityType: 'AuctionBid',
        entityId: String(bid.id)
      }
    });

    res.status(201).json(bid);

  } catch (err) {
    res.status(400).json({ error: err.message });
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
    res.status(500).json({ error: err.message });
  }
};

const acceptBid = async (req, res) => {
  try {
    const bidId = Number(req.params.id);

    const bid = await prisma.auctionBid.update({
      where: { id: bidId },
      data: { status: 'ACCEPTED' }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'BID_ACCEPTED',
        entityType: 'AuctionBid',
        entityId: String(bidId)
      }
    });

    res.json(bid);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const rejectBid = async (req, res) => {
  try {
    const bidId = Number(req.params.id);

    const bid = await prisma.auctionBid.update({
      where: { id: bidId },
      data: { status: 'REJECTED' }
    });

    await prisma.auditLog.create({
      data: {
        actorId: req.user.userId,
        action: 'BID_REJECTED',
        entityType: 'AuctionBid',
        entityId: String(bidId)
      }
    });

    res.json(bid);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getListingBids = async (req, res) => {
  try {
    const listingId = Number(req.params.id);

    const bids = await prisma.auctionBid.findMany({
      where: { listingId },
      include: { bidder: true }
    });

    res.json(bids);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createBid,
  getBids,
  acceptBid,
  rejectBid,
  getListingBids
};