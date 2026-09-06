const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, getOrderStats } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect);
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/stats', adminOnly, getOrderStats);
router.get('/', adminOnly, getAllOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', adminOnly, updateOrderStatus);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
