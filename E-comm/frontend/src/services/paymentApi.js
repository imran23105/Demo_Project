import api from './api';

export const paymentApi = {
  createStripeIntent: (amount, orderId) => api.post('/payments/stripe/create-intent', { amount, orderId }),
  confirmStripePayment: (paymentIntentId, orderId) => api.post('/payments/stripe/confirm', { paymentIntentId, orderId }),
  createRazorpayOrder: (amount, orderId) => api.post('/payments/razorpay/create-order', { amount, orderId }),
  verifyRazorpayPayment: (data) => api.post('/payments/razorpay/verify', data),
};
