import api from './api';

export const productApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  getProductBySlug: (slug) => api.get(`/products/slug/${slug}`),
  getRelatedProducts: (id) => api.get(`/products/${id}/related`),
  getTrending: () => api.get('/products', { params: { isTrending: true, limit: 10 } }),
  getFeatured: () => api.get('/products', { params: { isFeatured: true, limit: 8 } }),
  getBestSellers: () => api.get('/products', { params: { isBestSeller: true, limit: 8 } }),
  getStats: () => api.get('/products/stats'),
  // Admin
  createProduct: (data) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, data) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  deleteProductImage: (id, publicId) => api.delete(`/products/${id}/images/${encodeURIComponent(publicId)}`),
};

export const categoryApi = {
  getCategories: () => api.get('/categories'),
  getCategoryById: (id) => api.get(`/categories/${id}`),
  createCategory: (data) => api.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCategory: (id, data) => api.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCategory: (id) => api.delete(`/categories/${id}`),
};

export const reviewApi = {
  getReviews: (productId, params) => api.get(`/reviews/product/${productId}`, { params }),
  addReview: (productId, data) => api.post(`/reviews/product/${productId}`, data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};

export const wishlistApi = {
  getWishlist: () => api.get('/wishlist'),
};

export const cartApiService = {
  getCart: () => api.get('/cart'),
  addToCart: (productId, quantity) => api.post('/cart/add', { productId, quantity }),
  updateItem: (itemId, quantity) => api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  applyCoupon: (code) => api.post('/cart/coupon', { code }),
  removeCoupon: () => api.delete('/cart/coupon'),
};
