const express = require('express');
const router = express.Router();
const { getProductReviews, addReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:productId', getProductReviews);
router.post('/product/:productId', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
