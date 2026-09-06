const express = require('express');
const router = express.Router();
const {
  createStripeIntent,
  confirmStripePayment,
  createRazorpayOrderHandler,
  verifyRazorpayPayment,
  handleRazorpayWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// ─── Public Webhooks (No JWT Auth) ───────────────────────────────────────────
router.post('/razorpay/webhook', handleRazorpayWebhook);

// ─── Protected Routes ────────────────────────────────────────────────────────
router.use(protect);
router.post('/stripe/create-intent', createStripeIntent);
router.post('/stripe/confirm', confirmStripePayment);
router.post('/razorpay/create-order', createRazorpayOrderHandler);
router.post('/razorpay/verify', verifyRazorpayPayment);

module.exports = router;
