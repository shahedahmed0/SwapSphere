const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');

exports.createSwapRequest = async (req, res) => {
  try {
    const { receiverId, offeredItemId, requestedItemId } = req.body;
    const requesterId = req.user && req.user.id;

    if (!requesterId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!receiverId || !offeredItemId || !requestedItemId) {
      return res.status(400).json({ error: 'Missing required swap fields.' });
    }

    const newSwap = new SwapRequest({
      requester: requesterId,
      receiver: receiverId,
      offeredItem: offeredItemId,
      requestedItem: requestedItemId,
    });

    await newSwap.save();
    res.status(201).json({ message: 'Swap request sent successfully!', swap: newSwap });
  } catch (error) {
    console.error('createSwapRequest error', error);
    res.status(500).json({ error: 'Failed to initiate swap.' });
  }
};

exports.getUserSwaps = async (req, res) => {
  try {
    const userId = req.user && req.user.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const incomingRequests = await SwapRequest.find({ receiver: userId, status: 'Pending' })
      .populate('requester', 'username hobbyNiche')
      .populate('offeredItem requestedItem', 'title imageUrl');
    res.status(200).json({ incomingRequests });
  } catch (error) {
    console.error('getUserSwaps error', error);
    res.status(500).json({ error: 'Failed to fetch swap data.' });
  }
};

exports.acceptSwap = async (req, res) => {
  try {
    const swapId = req.params.id;
    const userId = req.user && req.user.id;

    const swap = await SwapRequest.findById(swapId);
    if (!swap) return res.status(404).json({ error: 'Swap not found.' });

    if (swap.receiver.toString() !== userId) {
      return res.status(403).json({ error: 'Not authorized to accept this swap.' });
    }

    if (swap.status !== 'Pending') {
      return res.status(400).json({ error: 'Swap is not pending.' });
    }

    swap.status = 'Accepted';
    await swap.save();

    await Item.updateMany(
      { _id: { $in: [swap.offeredItem, swap.requestedItem] } },
      { $set: { isAvailable: false, availability: 'Private Collection' } }
    );

    await SwapRequest.updateMany(
      {
        _id: { $ne: swapId },
        $or: [
          { offeredItem: { $in: [swap.offeredItem, swap.requestedItem] } },
          { requestedItem: { $in: [swap.offeredItem, swap.requestedItem] } },
        ],
        status: 'Pending',
      },
      { $set: { status: 'Rejected' } }
    );

    res.status(200).json({ message: 'Swap accepted and items updated!', swap });
  } catch (error) {
    console.error('acceptSwap error', error);
    res.status(500).json({ error: 'Failed to accept swap.' });
  }
};
