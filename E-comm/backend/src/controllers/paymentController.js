const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const {
  createStripePaymentIntent,
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
} = require('../services/paymentService');

// @desc    Create Stripe Payment Intent
// @route   POST /api/v1/payments/stripe/create-intent
const createStripeIntent = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;
  if (!amount) throw ApiError.badRequest('Amount is required');

  const paymentIntent = await createStripePaymentIntent(amount, 'inr', { orderId, userId: req.user._id.toString() });

  ApiResponse.success(res, 'Payment intent created', {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  });
});

// @desc    Confirm Stripe Payment
// @route   POST /api/v1/payments/stripe/confirm
const confirmStripePayment = asyncHandler(async (req, res) => {
  const { paymentIntentId, orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  order.paymentStatus = 'paid';
  order.paymentInfo = {
    transactionId: paymentIntentId,
    paymentId: paymentIntentId,
    paidAt: new Date(),
  };
  order.orderStatus = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'Payment confirmed via Stripe' });

  await order.save();
  ApiResponse.success(res, 'Payment confirmed', order);
});

// @desc    Create Razorpay Order
// @route   POST /api/v1/payments/razorpay/create-order
const createRazorpayOrderHandler = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body;
  if (!amount) throw ApiError.badRequest('Amount is required');

  const order = orderId ? await Order.findById(orderId) : null;
  const receipt = `rcpt_${(orderId || Date.now()).toString().slice(-10)}`;
  const notes = {
    orderId: orderId ? orderId.toString() : '',
    orderNumber: order?.orderNumber || '',
  };

  const razorpayOrder = await createRazorpayOrder(amount, 'INR', receipt, notes);

  if (order) {
    order.paymentInfo = {
      ...order.paymentInfo,
      orderId: razorpayOrder.id,
    };
    await order.save();
  }

  ApiResponse.success(res, 'Razorpay order created', {
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc    Verify Razorpay Payment
// @route   POST /api/v1/payments/razorpay/verify
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
  if (!isValid) throw ApiError.badRequest('Invalid payment signature');

  const order = await Order.findById(orderId);
  if (!order) throw ApiError.notFound('Order not found');

  order.paymentStatus = 'paid';
  order.paymentInfo = {
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
    paidAt: new Date(),
  };
  order.orderStatus = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', note: 'Payment verified via Razorpay' });

  await order.save();
  ApiResponse.success(res, 'Payment verified successfully', order);
});

// @desc    Handle Razorpay Webhook Events
// @route   POST /api/v1/payments/razorpay/webhook
const handleRazorpayWebhook = asyncHandler(async (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  if (webhookSecret) {
    const rawBody = req.rawBody ? req.rawBody.toString('utf8') : JSON.stringify(req.body);
    const isValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
    }
  }

  const { event, payload } = req.body;

  if (event === 'payment.captured' || event === 'order.paid') {
    const paymentEntity = payload?.payment?.entity;
    const rzpOrderId = paymentEntity?.order_id || payload?.order?.entity?.id;
    const paymentId = paymentEntity?.id;

    if (rzpOrderId) {
      const order = await Order.findOne({
        $or: [
          { 'paymentInfo.orderId': rzpOrderId },
          { orderNumber: paymentEntity?.notes?.orderNumber || '' },
          { _id: paymentEntity?.notes?.orderId || null },
        ].filter(Boolean),
      });

      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.paymentInfo = {
          orderId: rzpOrderId,
          paymentId: paymentId || order.paymentInfo?.paymentId,
          paidAt: new Date(),
        };
        order.statusHistory.push({
          status: 'confirmed',
          note: `Payment confirmed via Razorpay Webhook (${event})`,
        });
        await order.save();
      }
    }
  } else if (event === 'payment.failed') {
    const paymentEntity = payload?.payment?.entity;
    const rzpOrderId = paymentEntity?.order_id;
    if (rzpOrderId) {
      const order = await Order.findOne({ 'paymentInfo.orderId': rzpOrderId });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'failed';
        order.statusHistory.push({
          status: order.orderStatus,
          note: `Payment failed via Razorpay Webhook: ${paymentEntity?.error_description || 'Transaction declined'}`,
        });
        await order.save();
      }
    }
  }

  res.status(200).json({ status: 'ok' });
});

module.exports = {
  createStripeIntent,
  confirmStripePayment,
  createRazorpayOrderHandler,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
};
