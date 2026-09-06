const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { sendEmail, emailTemplates } = require('../services/emailService');

// @desc    Create order
// @route   POST /api/v1/orders
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, couponCode, items: bodyItems, couponDiscount } = req.body;

  if (!shippingAddress) {
    throw ApiError.badRequest('Shipping address is required');
  }
  const { fullName, phone, addressLine1, city, state, postalCode } = shippingAddress;
  if (!fullName?.trim() || !phone?.trim() || !addressLine1?.trim() || !city?.trim() || !state?.trim() || !postalCode?.trim()) {
    throw ApiError.badRequest('All shipping address fields (Full Name, Phone, Address, City, State, PIN code) are required');
  }
  if (!paymentMethod || !['stripe', 'razorpay', 'cod'].includes(paymentMethod)) {
    throw ApiError.badRequest('Valid payment method (razorpay, stripe, cod) is required');
  }

  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

  let cartItems = [];
  if (cart && cart.items.length > 0) {
    cartItems = cart.items;
  } else if (bodyItems && bodyItems.length > 0) {
    // Process items sent directly from frontend (supports guest/local carts converted on checkout)
    for (const item of bodyItems) {
      const prodId = item.product?._id || item.product || item._id;
      const product = await Product.findById(prodId);
      if (product) {
        cartItems.push({
          product,
          quantity: item.quantity || 1,
          price: product.price,
          discountPrice: product.discountPrice || 0,
          image: item.image || product.images?.[0]?.url || '',
          title: product.title,
        });
      }
    }
  }

  if (cartItems.length === 0) {
    throw ApiError.badRequest('Cart is empty. Please add items to your cart.');
  }

  // Validate stock for each item
  for (const item of cartItems) {
    if (!item.product || !item.product.isActive) {
      throw ApiError.badRequest(`Product "${item.title || 'Unknown'}" is unavailable`);
    }
    if (item.product.stock < item.quantity) {
      throw ApiError.badRequest(`Insufficient stock for "${item.product.title}". Only ${item.product.stock} left.`);
    }
  }

  const orderItems = cartItems.map((item) => {
    const unitPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
    return {
      product: item.product._id,
      title: item.product.title || item.title,
      image: item.image || item.product.images?.[0]?.url || '',
      price: unitPrice,
      quantity: item.quantity,
      subtotal: unitPrice * item.quantity,
    };
  });

  const subtotal = orderItems.reduce((t, i) => t + i.subtotal, 0);
  const shippingCost = subtotal >= 500 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const discount = Number(couponDiscount) || cart?.couponDiscount || 0;
  const totalAmount = Math.max(subtotal + shippingCost + tax - discount, 0);

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shippingCost,
    tax,
    couponDiscount: discount,
    couponCode: couponCode || cart?.couponCode || '',
    totalAmount,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    statusHistory: [{ status: 'pending', note: 'Order placed successfully' }],
  });

  // Deduct stock
  for (const item of cartItems) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Mark coupon as used
  if (couponCode) {
    await Coupon.findOneAndUpdate(
      { code: couponCode },
      { $inc: { usedCount: 1 }, $push: { usedBy: req.user._id } }
    );
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: '', couponDiscount: 0 });

  // Send confirmation email
  const populatedOrder = await order.populate('user', 'name email');
  if (populatedOrder.user && populatedOrder.user.email) {
    await sendEmail({
      to: populatedOrder.user.email,
      ...emailTemplates.orderConfirmation(populatedOrder.user.name, order.orderNumber, totalAmount),
    });
  }

  ApiResponse.created(res, 'Order placed successfully', order);
});

// @desc    Get user orders
// @route   GET /api/v1/orders/my-orders
const getMyOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments({ user: req.user._id }),
  ]);

  ApiResponse.paginated(res, 'Orders fetched', orders, page, limit, total);
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) throw ApiError.notFound('Order not found');
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw ApiError.forbidden('Access denied');
  }
  ApiResponse.success(res, 'Order fetched', order);
});

// @desc    Get all orders (admin)
// @route   GET /api/v1/orders
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const { status, paymentStatus, search } = req.query;

  const query = {};
  if (status) query.orderStatus = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;
  if (search) query.orderNumber = { $regex: search, $options: 'i' };

  const [orders, total] = await Promise.all([
    Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(query),
  ]);

  ApiResponse.paginated(res, 'Orders fetched', orders, page, limit, total);
});

// @desc    Update order status (admin)
// @route   PATCH /api/v1/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  order.orderStatus = status;
  order.statusHistory.push({ status, note: note || '' });
  if (status === 'delivered') {
    order.paymentStatus = 'paid';
    order.deliveredAt = Date.now();
  }

  await order.save();
  ApiResponse.success(res, 'Order status updated', order);
});

// @desc    Cancel order
// @route   PATCH /api/v1/orders/:id/cancel
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw ApiError.notFound('Order not found');

  if (['shipped', 'delivered'].includes(order.orderStatus)) {
    throw ApiError.badRequest('Cannot cancel a shipped or delivered order');
  }

  order.orderStatus = 'cancelled';
  order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Cancelled by user' });

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
  }

  await order.save();
  ApiResponse.success(res, 'Order cancelled', order);
});

// @desc    Get order stats (admin)
// @route   GET /api/v1/orders/stats
const getOrderStats = asyncHandler(async (req, res) => {
  const [totalOrders, pendingOrders, revenue, monthlyRevenue] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ orderStatus: 'pending' }),
    Order.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([
      { $match: { createdAt: { $gte: new Date(new Date().setDate(1)) } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),
  ]);

  ApiResponse.success(res, 'Stats fetched', {
    totalOrders,
    pendingOrders,
    totalRevenue: revenue[0]?.total || 0,
    monthlyRevenue: monthlyRevenue[0]?.total || 0,
    monthlyOrders: monthlyRevenue[0]?.count || 0,
  });
});

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, cancelOrder, getOrderStats };
