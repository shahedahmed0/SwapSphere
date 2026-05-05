const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema(
  {
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    swapId: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest' },
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    reason: { type: String, required: true, trim: true },
    details: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Resolved', 'Dismissed'],
      default: 'Open'
    },
    resolutionNote: { type: String, default: '', trim: true },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Dispute', DisputeSchema);
