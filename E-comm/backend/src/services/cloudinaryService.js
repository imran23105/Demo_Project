const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileBuffer, folder = 'nebula', options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        ...options,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

const uploadMultipleImages = async (files, folder = 'nebula') => {
  const uploadPromises = files.map((file) => uploadImage(file.buffer, folder));
  return Promise.all(uploadPromises);
};

const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error.message);
  }
};

const deleteMultipleImages = async (publicIds) => {
  const deletePromises = publicIds.map((id) => deleteImage(id));
  return Promise.all(deletePromises);
};

module.exports = { uploadImage, uploadMultipleImages, deleteImage, deleteMultipleImages };
