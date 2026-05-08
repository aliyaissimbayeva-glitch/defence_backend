const express = require('express');
const router = express.Router();


const { requireAuth } = require('../../middleware/auth.middleware');
const { requireRole } = require('../../middleware/role.middleware');
const prisma = require('../../lib/prisma');
const {
  createListingController,
  getListings,
  getListingById,
  deleteListing,
  updateDecayState
} = require('./listing.controller');
router.get('/', async (req, res) => {
  try {
    const { cursor, limit = 5 } = req.query;

    const listings = await prisma.listing.findMany({
      take: Number(limit),
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: Number(cursor) } : undefined,
      orderBy: { id: 'asc' }
    });

    res.json(listings);

  } catch (err) {
    res.status(500).json({
      error: { message: err.message }
    });
  }
});
router.patch(
  '/:id/decay',
  requireAuth,
  requireRole('ADMIN'),
  updateDecayState
);
router.get(
  '/:id',
  getListingById
);

router.delete(
  '/:id',
  requireAuth,
  requireRole('RESTAURANT', 'ADMIN'),
  deleteListing
);
module.exports = router;