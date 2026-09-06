const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Product title is required'], trim: true, maxlength: 200 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: [true, 'Description is required'] },
    shortDescription: { type: String, maxlength: 300 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: String, trim: true, default: '' },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
        alt: { type: String, default: '' },
      },
    ],
    tags: [{ type: String }],
    specifications: { type: Map, of: String },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    weight: { type: Number, default: 0 },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Virtual for effective price
productSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

// Virtual for reviews
productSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

// Auto-generate slug
productSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now();
  }
  // Auto-calculate discount percent
  if (this.price > 0 && this.discountPrice > 0) {
    this.discountPercent = Math.round(((this.price - this.discountPrice) / this.price) * 100);
  }
  next();
});

// Text index for search
productSchema.index({ title: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
