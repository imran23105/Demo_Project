import api from './api';

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

export const userApi = {
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updatePassword: (data) => api.put('/users/password', data),
  addAddress: (data) => api.post('/users/address', data),
  updateAddress: (id, data) => api.put(`/users/address/${id}`, data),
  deleteAddress: (id) => api.delete(`/users/address/${id}`),
  // Admin
  getAllUsers: (params) => api.get('/users', { params }),
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  toggleUserStatus: (id) => api.patch(`/users/${id}/status`),
  deleteUser: (id) => api.delete(`/users/${id}`),
};
