const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// @desc    Get all coupons
// @route   GET /api/v1/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
  
  // Format for frontend convenience
  const formattedCoupons = coupons.map((c) => ({
    ...c,
    currentUses: c.usedCount || 0,
    maxUses: c.usageLimit || 0,
  }));

  ApiResponse.success(res, 'Coupons fetched', formattedCoupons);
});

// @desc    Get single coupon by ID
// @route   GET /api/v1/coupons/:id
// @access  Private/Admin
const getCouponById = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw ApiError.notFound('Coupon not found');
  ApiResponse.success(res, 'Coupon fetched', coupon);
});

// @desc    Create new coupon
// @route   POST /api/v1/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const {
    code,
    description,
    discountType,
    discountValue,
    minOrderAmount,
    maxDiscountAmount,
    maxUses,
    usageLimit,
    expiresAt,
    isActive,
    applicableCategories,
  } = req.body;

  if (!code || !discountType || discountValue === undefined || discountValue === '') {
    throw ApiError.badRequest('Coupon code, discount type, and discount value are required');
  }

  const existing = await Coupon.findOne({ code: code.toUpperCase() });
  if (existing) throw ApiError.badRequest('Coupon with this code already exists');

  // Default expiry to 1 year from now if not provided
  const expiryDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const coupon = await Coupon.create({
    code: code.toUpperCase().trim(),
    description: description || '',
    discountType,
    discountValue: Number(discountValue),
    minOrderAmount: Number(minOrderAmount) || 0,
    maxDiscountAmount: Number(maxDiscountAmount) || 0,
    usageLimit: Number(maxUses || usageLimit) || 0,
    expiresAt: expiryDate,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    applicableCategories: applicableCategories || [],
  });

  ApiResponse.created(res, 'Coupon created', coupon);
});

// @desc    Update coupon
// @route   PUT /api/v1/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw ApiError.notFound('Coupon not found');

  const updates = { ...req.body };
  if (updates.code) updates.code = updates.code.toUpperCase().trim();
  if (updates.maxUses !== undefined) updates.usageLimit = Number(updates.maxUses) || 0;
  if (updates.discountValue !== undefined) updates.discountValue = Number(updates.discountValue);
  if (updates.minOrderAmount !== undefined) updates.minOrderAmount = Number(updates.minOrderAmount);

  const updated = await Coupon.findByIdAndUpdate(req.params.id, updates, { new: true });
  ApiResponse.success(res, 'Coupon updated', updated);
});

// @desc    Delete coupon
// @route   DELETE /api/v1/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) throw ApiError.notFound('Coupon not found');

  await coupon.deleteOne();
  ApiResponse.success(res, 'Coupon deleted');
});

module.exports = {
  getCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
