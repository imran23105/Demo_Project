const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, unique: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay', 'cod'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentInfo: {
      transactionId: { type: String },
      paymentId: { type: String },
      orderId: { type: String },
      signature: { type: String },
      paidAt: { type: Date },
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    couponDiscount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    notes: { type: String, default: '' },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate order number
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
