const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Dispute = require('../models/Dispute');
const User = require('../models/User');

router.post('/', auth, async (req, res) => {
  try {
    const { swapId, itemId, reason, details } = req.body || {};
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ message: 'Reason is required.' });
    }
    if (!swapId && !itemId) {
      return res.status(400).json({ message: 'Provide swapId or itemId.' });
    }

    const dispute = new Dispute({
      createdBy: req.user.id,
      swapId: swapId || undefined,
      itemId: itemId || undefined,
      reason: String(reason).trim(),
      details: details ? String(details).trim() : ''
    });
    await dispute.save();

    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) {
      const admins = await User.find({ isAdmin: true }).select('_id');
      admins.forEach((a) => {
        io.to(`user:${a._id}`).emit('new_notification', {
          type: 'dispute_created',
          message: 'New dispute/report submitted.',
          disputeId: dispute._id
        });
      });
    }
    res.status(201).json(dispute);
  } catch (err) {
    console.error('create dispute error', err);
    res.status(500).json({ message: 'Failed to create dispute.' });
  }
});

module.exports = router;
