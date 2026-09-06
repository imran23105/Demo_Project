const asyncHandler = require('express-async-handler');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const { generateTokenPair, generateAccessToken } = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../services/emailService');

// @desc    Register user
// @route   POST /api/v1/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
 
  const existingUser = await User.findOne({ email });
  if (existingUser) throw ApiError.conflict('Email already registered');

  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password,
    verificationToken,
  });

  const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
  await sendEmail({ to: email, ...emailTemplates.verifyEmail(name, verificationUrl) });
  await sendEmail({ to: email, ...emailTemplates.welcome(name) });

  const { accessToken, refreshToken } = generateTokenPair(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  ApiResponse.created(res, 'Registration successful! Please verify your email.', {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified },
    accessToken,
    refreshToken,
  });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) throw ApiError.unauthorized('Invalid email or password');

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw ApiError.unauthorized('Invalid email or password');

  if (!user.isActive) throw ApiError.unauthorized('Account deactivated. Contact support.');

  const { accessToken, refreshToken } = generateTokenPair(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  ApiResponse.success(res, 'Login successful', {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, isVerified: user.isVerified },
    accessToken,
    refreshToken,
  });
});

// @desc    Logout
// @route   POST /api/v1/auth/logout
const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });
  ApiResponse.success(res, 'Logged out successfully');
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) throw ApiError.unauthorized('Refresh token required');

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw ApiError.unauthorized('Invalid refresh token');
  }

  const accessToken = generateAccessToken(user._id);
  ApiResponse.success(res, 'Token refreshed', { accessToken });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw ApiError.notFound('No account found with this email');

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendEmail({ to: email, ...emailTemplates.resetPassword(user.name, resetUrl) });

  ApiResponse.success(res, 'Password reset email sent');
});

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select('+resetPasswordToken +resetPasswordExpire');

  if (!user) throw ApiError.badRequest('Invalid or expired reset token');

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  ApiResponse.success(res, 'Password reset successful');
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ verificationToken: req.params.token }).select('+verificationToken');
  if (!user) throw ApiError.badRequest('Invalid verification token');

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save({ validateBeforeSave: false });

  ApiResponse.success(res, 'Email verified successfully');
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  ApiResponse.success(res, 'User fetched', user);
});

module.exports = { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, getMe };
