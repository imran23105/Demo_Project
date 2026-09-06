const multer = require('multer');
const path = require('path');
const ApiError = require('../utils/ApiError');

// Memory storage for Cloudinary uploads
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file type. Only JPEG, PNG, WebP and GIF are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10,
  },
});

module.exports = { upload };
