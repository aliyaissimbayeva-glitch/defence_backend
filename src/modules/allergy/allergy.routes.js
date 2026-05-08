const express = require('express');
const router = express.Router();

const prisma = require('../../lib/prisma');
const { requireAuth } = require('../../middleware/auth.middleware');

router.post('/check', requireAuth, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({
        error: { message: 'Ingredients must be array' }
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    const conflict = ingredients.some(i =>
      user.allergies.includes(i)
    );

    res.json({
      safe: !conflict
    });

  } catch (err) {
    res.status(500).json({
      error: { message: err.message }
    });
  }
});

module.exports = router;