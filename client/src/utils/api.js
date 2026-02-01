import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

export const bakeryAPI = {
  getBakeries: (params) => api.get('/bakeries', { params }),
  getMyBakery: () => api.get('/bakeries/my'),
  createBakery: (formData) => api.post('/bakeries', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateBakery: (formData) => api.put('/bakeries/my', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getMyProducts: () => api.get('/products/my'),
  createProduct: (formData) => api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProduct: (id, formData) => api.put(`/products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: (params) => api.get('/orders/my', { params }),
  getOrderDetails: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  assignDeliveryBoy: (id, deliveryBoyId) => api.put(`/orders/${id}/assign`, { delivery_boy_id: deliveryBoyId }),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getBakeries: (params) => api.get('/admin/bakeries', { params }),
  approveBakery: (id) => api.put(`/admin/bakeries/${id}/approve`),
  blockUser: (id) => api.put(`/admin/users/${id}/block`),
  getAllOrders: (params) => api.get('/admin/orders', { params }),
};

export default api;