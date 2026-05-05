const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hobbyNiche: { type: String, default: 'General' },
    isAdmin: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },


    wishlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }],



    karmaPoints: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', UserSchema);
