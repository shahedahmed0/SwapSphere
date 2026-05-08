const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Back-compat (single-item offers)
    offeredItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    // New: bundle offers (2+ items for 1 rare item)
    offeredItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    requestedItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
      default: 'Pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
