const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const getProductReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Review.countDocuments({ product: req.params.productId }),
  ]);

  ApiResponse.paginated(res, 'Reviews fetched', reviews, page, limit, total);
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, title, comment } = req.body;
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  if (!product) throw ApiError.notFound('Product not found');

  // Check if user purchased the product
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': productId,
    paymentStatus: 'paid',
  });

  const existingReview = await Review.findOne({ user: req.user._id, product: productId });
  if (existingReview) throw ApiError.conflict('You have already reviewed this product');

  const review = await Review.create({
    user: req.user._id,
    product: productId,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!hasPurchased,
  });

  await review.populate('user', 'name avatar');
  ApiResponse.created(res, 'Review added successfully', review);
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');
  if (review.user.toString() !== req.user._id.toString()) throw ApiError.forbidden('Not authorized');

  Object.assign(review, req.body);
  await review.save();
  await review.populate('user', 'name avatar');
  ApiResponse.success(res, 'Review updated', review);
});

const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw ApiError.notFound('Review not found');

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') throw ApiError.forbidden('Not authorized');

  await review.deleteOne();
  ApiResponse.success(res, 'Review deleted');
});

module.exports = { getProductReviews, addReview, updateReview, deleteReview };
