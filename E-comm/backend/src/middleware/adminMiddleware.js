const ApiError = require('../utils/ApiError');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  throw ApiError.forbidden('Access denied. Admin only.');
};

module.exports = { adminOnly };
