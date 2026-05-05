const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Dispute = require('../models/Dispute');

router.get('/disputes', auth, admin, async (req, res) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 })
      .populate('createdBy', 'username email hobbyNiche')
      .populate('swapId')
      .populate('itemId');
    res.json(disputes);
  } catch (err) {
    console.error('admin disputes error', err);
    res.status(500).json({ message: 'Failed to load disputes.' });
  }
});

router.put('/disputes/:id', auth, admin, async (req, res) => {
  try {
    const { status, resolutionNote } = req.body || {};
    const allowed = new Set(['Open', 'Under Review', 'Resolved', 'Dismissed']);
    if (status && !allowed.has(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }
    const dispute = await Dispute.findById(req.params.id);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found.' });

    if (status) dispute.status = status;
    if (typeof resolutionNote === 'string') dispute.resolutionNote = resolutionNote;
    dispute.resolvedBy = req.user.id;
    await dispute.save();

    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) {
      io.to(`user:${dispute.createdBy}`).emit('new_notification', {
        type: 'dispute_updated',
        message: `Your dispute was updated to: ${dispute.status}.`,
        disputeId: dispute._id
      });
    }
    res.json(dispute);
  } catch (err) {
    console.error('update dispute error', err);
    res.status(500).json({ message: 'Failed to update dispute.' });
  }
});

module.exports = router;
