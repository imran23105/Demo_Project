const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1, name: 1 });
  ApiResponse.success(res, 'Categories fetched', categories);
});

const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');
  ApiResponse.success(res, 'Category fetched', category);
});

const createCategory = asyncHandler(async (req, res) => {
  let image = '';
  let imagePublicId = '';
  if (req.file) {
    const result = await uploadImage(req.file.buffer, 'nebula/categories');
    image = result.secure_url;
    imagePublicId = result.public_id;
  }
  const category = await Category.create({ ...req.body, image, imagePublicId });
  ApiResponse.created(res, 'Category created', category);
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');

  if (req.file) {
    if (category.imagePublicId) await deleteImage(category.imagePublicId);
    const result = await uploadImage(req.file.buffer, 'nebula/categories');
    req.body.image = result.secure_url;
    req.body.imagePublicId = result.public_id;
  }

  const updated = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  ApiResponse.success(res, 'Category updated', updated);
});

const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw ApiError.notFound('Category not found');

  const hasProducts = await Product.exists({ category: req.params.id });
  if (hasProducts) throw ApiError.badRequest('Cannot delete category with existing products');

  if (category.imagePublicId) await deleteImage(category.imagePublicId);
  await category.deleteOne();
  ApiResponse.success(res, 'Category deleted');
});

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
