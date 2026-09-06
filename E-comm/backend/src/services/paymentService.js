const stripe = require('../config/stripe');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ─── Stripe ───────────────────────────────────────────────────────────────────
const createStripePaymentIntent = async (amount, currency = 'inr', metadata = {}) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });
  return paymentIntent;
};

const confirmStripePayment = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return paymentIntent;
};

// ─── Razorpay ─────────────────────────────────────────────────────────────────
const createRazorpayOrder = async (amount, currency = 'INR', receipt, notes = {}) => {
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Convert to paise
    currency,
    receipt,
    payment_capture: 1,
    notes,
  });
  return order;
};

const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const body = orderId + '|' + paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
};

const verifyRazorpayWebhookSignature = (rawBody, signature, secret) => {
  if (!signature || !secret || !rawBody) return false;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  const expectedBuf = Buffer.from(expectedSignature, 'utf8');
  const signatureBuf = Buffer.from(signature, 'utf8');

  if (expectedBuf.length !== signatureBuf.length) {
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, signatureBuf);
};

module.exports = {
  createStripePaymentIntent,
  confirmStripePayment,
  createRazorpayOrder,
  verifyRazorpaySignature,
  verifyRazorpayWebhookSignature,
};
