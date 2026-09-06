const express = require('express');
const router = express.Router();
const {
  getAllUsers, getUserById, updateProfile, updatePassword,
  addAddress, updateAddress, deleteAddress,
  updateUserRole, toggleUserStatus, deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// User routes
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.put('/password', protect, updatePassword);
router.post('/address', protect, addAddress);
router.put('/address/:addressId', protect, updateAddress);
router.delete('/address/:addressId', protect, deleteAddress);

// Admin routes
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.patch('/:id/role', protect, adminOnly, updateUserRole);
router.patch('/:id/status', protect, adminOnly, toggleUserStatus);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
