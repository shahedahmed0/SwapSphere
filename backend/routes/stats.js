const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Item = require('../models/Item');
const SwapRequest = require('../models/SwapRequest');

router.get('/', async (req, res) => {
  try {
    const [activeCollectors, itemsListed, successfulSwaps, niches] = await Promise.all([
      User.countDocuments({}),
      Item.countDocuments({}),
      SwapRequest.countDocuments({ status: 'Completed' }),
      User.distinct('hobbyNiche')
    ]);

    const hobbyNiches = Array.isArray(niches)
      ? niches.map((n) => (n ? String(n).trim() : '')).filter((n) => n.length > 0)
      : [];

    res.json({
      activeCollectors,
      successfulSwaps,
      itemsListed,
      hobbyNiches: hobbyNiches.length
    });
  } catch (err) {
    console.error('stats error', err);
    res.status(500).json({ message: 'Failed to load stats.' });
  }
});

module.exports = router;

