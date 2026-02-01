const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const { 
  createOrder, 
  getMyOrders, 
  getOrderDetails, 
  updateOrderStatus, 
  assignDeliveryBoy 
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', auth, authorize('customer'), createOrder);
router.get('/my', auth, getMyOrders);
router.get('/:id', auth, getOrderDetails);
router.put('/:id/status', auth, updateOrderStatus);
router.put('/:id/assign', auth, authorize('baker', 'admin'), assignDeliveryBoy);

module.exports = router;