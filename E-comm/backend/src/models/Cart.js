const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  price: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  image: { type: String },
  title: { type: String },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    couponCode: { type: String, default: '' },
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for total price
cartSchema.virtual('totalPrice').get(function () {
  const subtotal = this.items.reduce((total, item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.price;
    return total + price * item.quantity;
  }, 0);
  return subtotal - this.couponDiscount;
});

cartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

module.exports = mongoose.model('Cart', cartSchema);
