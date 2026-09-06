const express = require('express');
const router = express.Router();
const {
  getProducts, getProductById, getProductBySlug, getRelatedProducts,
  createProduct, updateProduct, deleteProduct, deleteProductImage, getProductStats,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProducts);
router.get('/stats', protect, adminOnly, getProductStats);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

// Admin routes
router.post('/', protect, adminOnly, upload.array('images', 10), createProduct);
router.put('/:id', protect, adminOnly, upload.array('images', 10), updateProduct);
router.delete('/:id/images/:publicId', protect, adminOnly, deleteProductImage);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
