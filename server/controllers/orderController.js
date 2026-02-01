const { Order, OrderItem } = require('../models/Order');
const Product = require('../models/Product');
const Bakery = require('../models/Bakery');

const createOrder = async (req, res) => {
  try {
    const {
      bakery_id,
      items,
      delivery_address,
      delivery_date,
      delivery_time,
      customer_phone,
      special_instructions,
      payment_method
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product || !product.is_available) {
        return res.status(400).json({ message: `Product ${item.product_id} not available` });
      }

      const weightOption = product.weight_options.find(
        w => w.weight === item.weight
      );
      if (!weightOption) {
        return res.status(400).json({ message: `Weight option ${item.weight} not found` });
      }

      const itemPrice = weightOption.price * item.quantity;
      total_amount += itemPrice;

      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: weightOption.price,
        weight: item.weight,
        egg_type: item.egg_type,
        custom_message: item.custom_message
      });
    }

    const order = new Order({
      customer_id: req.user.id,
      bakery_id,
      total_amount,
      delivery_address,
      delivery_date,
      delivery_time,
      customer_phone,
      special_instructions,
      payment_method: payment_method || 'cod'
    });

    await order.save();

    for (const item of orderItems) {
      const orderItem = new OrderItem({
        order_id: order._id,
        ...item
      });
      await orderItem.save();
    }

    await order.populate([
      { path: 'customer_id', select: 'name email phone' },
      { path: 'bakery_id', select: 'bakery_name city address' }
    ]);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (req.user.role === 'customer') {
      query.customer_id = req.user.id;
    } else if (req.user.role === 'baker') {
      const bakery = await Bakery.findOne({ owner_id: req.user.id });
      if (!bakery) {
        return res.status(404).json({ message: 'Bakery not found' });
      }
      query.bakery_id = bakery._id;
    } else if (req.user.role === 'delivery') {
      query.delivery_boy_id = req.user.id;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer_id', 'name email phone')
      .populate('bakery_id', 'bakery_name city address')
      .populate('delivery_boy_id', 'name phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer_id', 'name email phone')
      .populate('bakery_id', 'bakery_name city address')
      .populate('delivery_boy_id', 'name phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const orderItems = await OrderItem.find({ order_id: order._id })
      .populate('product_id', 'name image_url');

    res.json({ order, items: orderItems });
  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role === 'baker') {
      const bakery = await Bakery.findOne({ owner_id: req.user.id });
      if (!bakery || !order.bakery_id.equals(bakery._id)) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
      
      const validStatuses = ['confirmed', 'baking', 'ready', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status for baker' });
      }
    } else if (req.user.role === 'delivery') {
      if (order.delivery_boy_id && !order.delivery_boy_id.equals(req.user.id)) {
        return res.status(403).json({ message: 'Not authorized to update this order' });
      }
      
      const validStatuses = ['out_for_delivery', 'delivered'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status for delivery boy' });
      }
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const assignDeliveryBoy = async (req, res) => {
  try {
    const { delivery_boy_id } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status !== 'ready') {
      return res.status(400).json({ message: 'Order must be ready for delivery' });
    }

    order.delivery_boy_id = delivery_boy_id;
    order.status = 'out_for_delivery';
    await order.save();

    res.json(order);
  } catch (error) {
    console.error('Assign delivery boy error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  createOrder, 
  getMyOrders, 
  getOrderDetails, 
  updateOrderStatus, 
  assignDeliveryBoy 
};