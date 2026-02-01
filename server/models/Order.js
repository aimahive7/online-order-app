const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bakery_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bakery',
    required: true
  },
  delivery_boy_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['ordered', 'confirmed', 'baking', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'ordered'
  },
  delivery_date: {
    type: Date,
    required: true
  },
  delivery_time: {
    type: String,
    required: true
  },
  delivery_address: {
    type: String,
    required: true
  },
  customer_phone: {
    type: String,
    required: true
  },
  special_instructions: {
    type: String,
    trim: true
  },
  payment_method: {
    type: String,
    enum: ['cod', 'online'],
    default: 'cod'
  },
  payment_status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  }
}, {
  timestamps: true
});

const orderItemSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  weight: {
    type: String,
    required: true
  },
  egg_type: {
    type: String,
    enum: ['egg', 'eggless'],
    required: true
  },
  custom_message: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

module.exports = { Order, OrderItem };