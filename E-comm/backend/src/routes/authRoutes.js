const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, logout, refreshToken, forgotPassword, resetPassword, verifyEmail, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.put('/reset-password/:token', [body('password').isLength({ min: 6 })], validate, resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/me', protect, getMe);

module.exports = router;
