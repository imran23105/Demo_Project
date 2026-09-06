const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], trim: true, unique: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
    icon: { type: String, default: '' },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-generate slug
categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
