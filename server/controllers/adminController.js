const User = require('../models/User');
const Bakery = require('../models/Bakery');
const { Order } = require('../models/Order');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalBakeries = await Bakery.countDocuments({ is_approved: true });
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$total_amount' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('customer_id', 'name')
      .populate('bakery_id', 'bakery_name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalUsers,
      totalBakeries,
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentOrders
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getBakeries = async (req, res) => {
  try {
    const { is_approved, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (typeof is_approved !== 'undefined') {
      query.is_approved = is_approved === 'true';
    }

    const bakeries = await Bakery.find(query)
      .populate('owner_id', 'name email phone')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Bakery.countDocuments(query);

    res.json({
      bakeries,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get bakeries error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const approveBakery = async (req, res) => {
  try {
    const bakery = await Bakery.findByIdAndUpdate(
      req.params.id,
      { is_approved: true },
      { new: true }
    ).populate('owner_id', 'name email');

    if (!bakery) {
      return res.status(404).json({ message: 'Bakery not found' });
    }

    res.json(bakery);
  } catch (error) {
    console.error('Approve bakery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isApproved = !user.isApproved;
    await user.save();

    res.json({ message: `User ${user.isApproved ? 'unblocked' : 'blocked'} successfully` });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('customer_id', 'name email phone')
      .populate('bakery_id', 'bakery_name city')
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
    console.error('Get all orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getBakeries,
  approveBakery,
  blockUser,
  getAllOrders
};