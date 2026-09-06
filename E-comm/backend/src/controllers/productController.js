const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadMultipleImages, deleteImage, deleteMultipleImages } = require('../services/cloudinaryService');

// @desc    Get all products with filter/sort/pagination
// @route   GET /api/v1/products
const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, sort = '-createdAt',
    category, brand, minPrice, maxPrice,
    minRating, search, isFeatured, isTrending, isBestSeller,
  } = req.query;

  const query = { isActive: true };

  if (category) query.category = category;
  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minRating) query.ratings = { $gte: Number(minRating) };
  if (isFeatured === 'true') query.isFeatured = true;
  if (isTrending === 'true') query.isTrending = true;
  if (isBestSeller === 'true') query.isBestSeller = true;
  if (search) {
    query.$text = { $search: search };
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  ApiResponse.paginated(res, 'Products fetched', products, page, limit, total);
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, isActive: true })
    .populate('category', 'name slug')
    .populate({ path: 'reviews', populate: { path: 'user', select: 'name avatar' }, options: { limit: 10 } });

  if (!product) throw ApiError.notFound('Product not found');
  ApiResponse.success(res, 'Product fetched', product);
});

// @desc    Get product by slug
// @route   GET /api/v1/products/slug/:slug
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true })
    .populate('category', 'name slug');
  if (!product) throw ApiError.notFound('Product not found');
  ApiResponse.success(res, 'Product fetched', product);
});

// @desc    Get related products
// @route   GET /api/v1/products/:id/related
const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(8)
    .populate('category', 'name');

  ApiResponse.success(res, 'Related products fetched', related);
});

// @desc    Create product (admin)
// @route   POST /api/v1/products
const createProduct = asyncHandler(async (req, res) => {
  let images = [];
  if (req.files && req.files.length > 0) {
    const uploadResults = await uploadMultipleImages(req.files, 'nebula/products');
    images = uploadResults.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
  }

  const product = await Product.create({ ...req.body, images });
  ApiResponse.created(res, 'Product created', product);
});

// @desc    Update product (admin)
// @route   PUT /api/v1/products/:id
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  let newImages = product.images;
  if (req.files && req.files.length > 0) {
    const uploadResults = await uploadMultipleImages(req.files, 'nebula/products');
    const uploaded = uploadResults.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
    newImages = [...newImages, ...uploaded];
  }

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { ...req.body, images: newImages },
    { new: true, runValidators: true }
  ).populate('category', 'name');

  ApiResponse.success(res, 'Product updated', updated);
});

// @desc    Delete product image
// @route   DELETE /api/v1/products/:id/images/:publicId
const deleteProductImage = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  const publicId = decodeURIComponent(req.params.publicId);
  await deleteImage(publicId);
  product.images = product.images.filter((img) => img.publicId !== publicId);
  await product.save();

  ApiResponse.success(res, 'Image deleted', product);
});

// @desc    Delete product (admin)
// @route   DELETE /api/v1/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw ApiError.notFound('Product not found');

  const publicIds = product.images.map((img) => img.publicId).filter(Boolean);
  if (publicIds.length) await deleteMultipleImages(publicIds);

  await product.deleteOne();
  ApiResponse.success(res, 'Product deleted');
});

// @desc    Get dashboard stats (admin)
// @route   GET /api/v1/products/stats
const getProductStats = asyncHandler(async (req, res) => {
  const [total, outOfStock, featured] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    Product.countDocuments({ stock: 0, isActive: true }),
    Product.countDocuments({ isFeatured: true }),
  ]);
  ApiResponse.success(res, 'Stats fetched', { total, outOfStock, featured });
});

module.exports = {
  getProducts, getProductById, getProductBySlug, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, deleteProductImage, getProductStats,
};
