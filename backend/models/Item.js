const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    condition: {
      type: String,
      enum: ['Mint', 'Used', 'Rare'],
      default: 'Used'
    },


    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },


    isAvailable: { type: Boolean, default: true },


    availability: {
      type: String,
      enum: ['Available for Swap', 'Private Collection'],
      default: 'Available for Swap'
    },


    category: {
      type: String,
      default: 'Others'
    },

    // --> ADDED FIELD <--
    conditionChecklist: {
      type: [String],
      default: []
    },


    tags: {
      type: [String],
      default: []
    },


    location: {
      type: String,
      default: '',
      trim: true
    },

    imageUrl: String
  },
  { timestamps: true }
);


ItemSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  category: 'text'
});

module.exports = mongoose.model('Item', ItemSchema);