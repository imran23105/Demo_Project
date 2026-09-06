const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { uploadImage, deleteImage } = require('../services/cloudinaryService');

// @desc    Get all users (admin)
// @route   GET /api/v1/users
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  const query = search
    ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
    : {};

  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query),
  ]);

  ApiResponse.paginated(res, 'Users fetched', users, page, limit, total);
});

// @desc    Get user by ID (admin)
// @route   GET /api/v1/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, 'User fetched', user);
});

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (phone) user.phone = phone;

  // Handle avatar upload
  if (req.file) {
    if (user.avatarPublicId) await deleteImage(user.avatarPublicId);
    const result = await uploadImage(req.file.buffer, 'nebula/avatars');
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
  }

  await user.save({ validateBeforeSave: false });
  ApiResponse.success(res, 'Profile updated', user);
});

// @desc    Update password
// @route   PUT /api/v1/users/password
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw ApiError.unauthorized('Current password is incorrect');

  user.password = newPassword;
  await user.save();

  ApiResponse.success(res, 'Password updated successfully');
});

// @desc    Add address
// @route   POST /api/v1/users/address
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  user.addresses.push(req.body);
  await user.save({ validateBeforeSave: false });
  ApiResponse.success(res, 'Address added', user.addresses);
});

// @desc    Update address
// @route   PUT /api/v1/users/address/:addressId
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) throw ApiError.notFound('Address not found');

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }
  Object.assign(address, req.body);
  await user.save({ validateBeforeSave: false });
  ApiResponse.success(res, 'Address updated', user.addresses);
});

// @desc    Delete address
// @route   DELETE /api/v1/users/address/:addressId
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save({ validateBeforeSave: false });
  ApiResponse.success(res, 'Address deleted', user.addresses);
});

// @desc    Update user role (admin)
// @route   PATCH /api/v1/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, 'User role updated', user);
});

// @desc    Toggle user active status (admin)
// @route   PATCH /api/v1/users/:id/status
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });
  ApiResponse.success(res, `User ${user.isActive ? 'activated' : 'deactivated'}`, user);
});

// @desc    Delete user (admin)
// @route   DELETE /api/v1/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw ApiError.notFound('User not found');
  ApiResponse.success(res, 'User deleted');
});

module.exports = {
  getAllUsers, getUserById, updateProfile, updatePassword,
  addAddress, updateAddress, deleteAddress,
  updateUserRole, toggleUserStatus, deleteUser,
};
