const SwapRequest = require('../models/SwapRequest');
const Item = require('../models/Item');
const User = require('../models/User');
const Review = require('../models/Review');

function normalizeOfferedItems({ offeredItemId, offeredItemIds }) {
  if (Array.isArray(offeredItemIds)) return offeredItemIds.filter(Boolean);
  if (typeof offeredItemIds === 'string' && offeredItemIds.trim()) {
    return offeredItemIds.split(',').map((s) => s.trim()).filter(Boolean);
  }
  if (offeredItemId) return [offeredItemId];
  return [];
}

exports.createSwapRequest = async (req, res) => {
  try {
    const { receiverId, offeredItemId, offeredItemIds, requestedItemId } = req.body;
    const requesterId = req.user && req.user.id;

    if (!requesterId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    const offeredItems = normalizeOfferedItems({ offeredItemId, offeredItemIds });
    if (!receiverId || offeredItems.length === 0 || !requestedItemId) {
      return res.status(400).json({ error: 'Missing required swap fields.' });
    }

    if (new Set(offeredItems.map(String)).size !== offeredItems.length) {
      return res.status(400).json({ error: 'Duplicate offered items are not allowed.' });
    }

    const requested = await Item.findById(requestedItemId).select('ownerId isAvailable availability condition');
    if (!requested) {
      return res.status(404).json({ error: 'Requested item not found.' });
    }
    if (!requested.isAvailable || requested.availability !== 'Available for Swap') {
      return res.status(400).json({ error: 'Requested item is not available for swap.' });
    }
    if (String(requested.ownerId) !== String(receiverId)) {
      return res.status(400).json({ error: 'Receiver mismatch for requested item.' });
    }

    const offered = await Item.find({ _id: { $in: offeredItems } }).select('ownerId isAvailable availability');
    if (offered.length !== offeredItems.length) {
      return res.status(404).json({ error: 'One or more offered items were not found.' });
    }
    for (const it of offered) {
      if (String(it.ownerId) !== String(requesterId)) {
        return res.status(403).json({ error: 'You can only offer items you own.' });
      }
      if (!it.isAvailable || it.availability !== 'Available for Swap') {
        return res.status(400).json({ error: 'All offered items must be available for swap.' });
      }
    }

    if (requested.condition === 'Rare' && offeredItems.length < 2) {
      return res.status(400).json({ error: 'Rare items require a bundle offer (2+ items).' });
    }
    if (requested.condition !== 'Rare' && offeredItems.length !== 1) {
      return res.status(400).json({ error: 'Non-rare items require exactly 1 offered item.' });
    }

    const newSwap = new SwapRequest({
      requester: requesterId,
      receiver: receiverId,
      offeredItem: offeredItems[0],
      offeredItems,
      requestedItem: requestedItemId
    });

    await newSwap.save();

    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) {
      io.to(`user:${receiverId}`).emit('new_notification', {
        type: 'swap_request',
        message: 'New swap request received.',
        swapId: newSwap._id
      });
    }
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

    const incomingRequests = await SwapRequest.find({ receiver: userId, status: 'Pending' }).
    populate('requester', 'username hobbyNiche karmaPoints rating reviewCount').
    populate('offeredItem offeredItems requestedItem', 'title imageUrl');

    const history = await SwapRequest.find({
      $or: [{ requester: userId }, { receiver: userId }],
      status: { $in: ['Accepted', 'Completed'] }
    }).populate('requester receiver offeredItem offeredItems requestedItem');

    res.status(200).json({ incomingRequests, history });
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

    const offeredIds = Array.isArray(swap.offeredItems) && swap.offeredItems.length > 0
      ? swap.offeredItems
      : (swap.offeredItem ? [swap.offeredItem] : []);
    const allSwapItemIds = [...offeredIds, swap.requestedItem].filter(Boolean);

    await Item.updateMany(
      { _id: { $in: allSwapItemIds } },
      { $set: { isAvailable: false, availability: 'Private Collection' } }
    );

    await SwapRequest.updateMany(
      {
        _id: { $ne: swapId },
        $or: [
        { offeredItem: { $in: allSwapItemIds } },
        { offeredItems: { $in: allSwapItemIds } },
        { requestedItem: { $in: allSwapItemIds } }],

        status: 'Pending'
      },
      { $set: { status: 'Rejected' } }
    );

    const io = req.app && req.app.get ? req.app.get('io') : null;
    if (io) {
      io.to(`user:${swap.requester}`).emit('new_notification', {
        type: 'swap_accepted',
        message: 'Your swap request was accepted.',
        swapId: swap._id
      });
    }
    res.status(200).json({ message: 'Swap accepted and items updated!', swap });
  } catch (error) {
    console.error('acceptSwap error', error);
    res.status(500).json({ error: 'Failed to accept swap.' });
  }
};


exports.leaveReview = async (req, res) => {
  try {
    const { swapId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user && req.user.id;

    if (!reviewerId) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!swapId || !revieweeId || !rating) {
      return res.status(400).json({ error: 'Missing required review fields.' });
    }

    const swap = await SwapRequest.findById(swapId);
    if (!swap) {
      return res.status(404).json({ error: 'Swap not found.' });
    }

    if (
    swap.requester.toString() !== reviewerId &&
    swap.receiver.toString() !== reviewerId)
    {
      return res.status(403).json({ error: 'You were not part of this swap.' });
    }

    const review = new Review({
      swap: swapId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment
    });
    await review.save();

    const reviewee = await User.findById(revieweeId);
    if (!reviewee) {
      return res.status(404).json({ error: 'User to review not found.' });
    }

    let karmaChange = 0;
    if (rating >= 4) karmaChange = 10;
    if (rating <= 2) karmaChange = -5;

    reviewee.karmaPoints += karmaChange;
    reviewee.reviewCount += 1;
    const previousTotal = reviewee.rating * (reviewee.reviewCount - 1);
    reviewee.rating = (previousTotal + rating) / reviewee.reviewCount;

    await reviewee.save();

    await SwapRequest.findByIdAndUpdate(swapId, { status: 'Completed' });

    res.
    status(201).
    json({ message: 'Review posted and Karma updated!', review });
  } catch (error) {
    console.error('leaveReview error', error);
    res.status(500).json({ error: 'Failed to post review.' });
  }
};
