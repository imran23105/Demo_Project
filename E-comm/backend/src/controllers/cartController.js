const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'title images price discountPrice stock isActive');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  ApiResponse.success(res, 'Cart fetched', cart);
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw ApiError.notFound('Product not found');
  if (product.stock < quantity) throw ApiError.badRequest(`Only ${product.stock} items available`);

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) cart = new Cart({ user: req.user._id, items: [] });

  const existingItem = cart.items.find((item) => item.product.toString() === productId);
  if (existingItem) {
    const newQty = existingItem.quantity + parseInt(quantity);
    if (newQty > product.stock) throw ApiError.badRequest(`Only ${product.stock} items available`);
    existingItem.quantity = newQty;
  } else {
    cart.items.push({
      product: productId,
      quantity: parseInt(quantity),
      price: product.price,
      discountPrice: product.discountPrice || 0,
      image: product.images[0]?.url || '',
      title: product.title,
    });
  }

  await cart.save();
  await cart.populate('items.product', 'title images price discountPrice stock');
  ApiResponse.success(res, 'Item added to cart', cart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  const item = cart.items.find((i) => i._id.toString() === req.params.itemId);
  if (!item) throw ApiError.notFound('Cart item not found');

  const product = await Product.findById(item.product);
  if (quantity > product.stock) throw ApiError.badRequest(`Only ${product.stock} items available`);

  item.quantity = parseInt(quantity);
  await cart.save();
  await cart.populate('items.product', 'title images price discountPrice stock');
  ApiResponse.success(res, 'Cart updated', cart);
});

const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) throw ApiError.notFound('Cart not found');

  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  ApiResponse.success(res, 'Item removed from cart', cart);
});

const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], couponCode: '', couponDiscount: 0 });
  ApiResponse.success(res, 'Cart cleared');
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) throw ApiError.badRequest('Cart is empty');

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw ApiError.notFound('Invalid coupon code');
  if (new Date() > coupon.expiresAt) throw ApiError.badRequest('Coupon has expired');
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) throw ApiError.badRequest('Coupon usage limit reached');
  if (coupon.usedBy.includes(req.user._id)) throw ApiError.badRequest('You have already used this coupon');

  const subtotal = cart.items.reduce((t, i) => t + (i.discountPrice || i.price) * i.quantity, 0);
  if (subtotal < coupon.minOrderAmount) {
    throw ApiError.badRequest(`Minimum order amount is ₹${coupon.minOrderAmount}`);
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = (subtotal * coupon.discountValue) / 100;
    if (coupon.maxDiscountAmount > 0) discount = Math.min(discount, coupon.maxDiscountAmount);
  } else {
    discount = coupon.discountValue;
  }

  cart.couponCode = coupon.code;
  cart.couponDiscount = Math.round(discount);
  await cart.save();
  ApiResponse.success(res, `Coupon applied! You saved ₹${discount.toFixed(0)}`, cart);
});

const removeCoupon = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { couponCode: '', couponDiscount: 0 });
  ApiResponse.success(res, 'Coupon removed');
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart, applyCoupon, removeCoupon };
