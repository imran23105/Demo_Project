const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: [true, 'Rating is required'], min: 1, max: 5 },
    title: { type: String, maxlength: 100 },
    comment: { type: String, required: [true, 'Comment is required'], maxlength: 1000 },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product ratings after save/remove
reviewSchema.statics.updateProductRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: '$product', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } },
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      ratings: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews,
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, { ratings: 0, numReviews: 0 });
  }
};

reviewSchema.post('save', function () {
  this.constructor.updateProductRatings(this.product);
});

reviewSchema.post('remove', function () {
  this.constructor.updateProductRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
