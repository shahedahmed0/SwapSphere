const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    swap: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviewee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxLength: 500 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
