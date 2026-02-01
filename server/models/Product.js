const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  bakery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bakery',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  weight_options: [{
    weight: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  egg_type: {
    type: String,
    enum: ['egg', 'eggless', 'both'],
    required: [true, 'Egg type is required']
  },
  category: {
    type: String,
    enum: ['cake', 'pastry', 'cookie', 'custom'],
    required: [true, 'Category is required']
  },
  image_url: {
    type: String,
    required: [true, 'Image is required']
  },
  is_available: {
    type: Boolean,
    default: true
  },
  custom_message_available: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);