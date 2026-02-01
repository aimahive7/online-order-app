const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  getBakeries,
  approveBakery,
  blockUser,
  getAllOrders
} = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', auth, authorize('admin'), getDashboardStats);
router.get('/users', auth, authorize('admin'), getUsers);
router.get('/bakeries', auth, authorize('admin'), getBakeries);
router.put('/bakeries/:id/approve', auth, authorize('admin'), approveBakery);
router.put('/users/:id/block', auth, authorize('admin'), blockUser);
router.get('/orders', auth, authorize('admin'), getAllOrders);

module.exports = router;