const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  swapId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});


MessageSchema.index({ swapId: 1, timestamp: 1 });

module.exports = mongoose.model('Message', MessageSchema);
