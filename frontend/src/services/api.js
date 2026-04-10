import axios from 'axios';
import useStore from '../store/useStore';

// Access the API on port 3000 (if running via npm) or 3001 (if running via Docker as you configured)
// Update this if your backend port is different.
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

// Interceptor to inject JWT token into requests
api.interceptors.request.use(
  (config) => {
    const token = useStore.getState().token; // Assuming we store token in Zustand
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth Endpoints ---
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// --- Product Endpoints ---
export const getProducts = async (params = {}) => {
  // params can include { page, limit, search, categoryId }
  const response = await api.get('/products', { params });
  return response.data; // Returns { data, total, page, lastPage }
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// --- Category Endpoints ---
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// --- Cart Endpoints ---
export const getCartApi = async () => {
  const response = await api.get('/carts');
  return response.data;
};

export const addToCartApi = async (productId, quantity) => {
  const response = await api.post('/carts/items', { productId, quantity });
  return response.data;
};

export const updateCartItemApi = async (cartItemId, quantity) => {
  const response = await api.patch(`/carts/items/${cartItemId}`, { quantity });
  return response.data;
};

export const removeCartItemApi = async (cartItemId) => {
  const response = await api.delete(`/carts/items/${cartItemId}`);
  return response.data;
};

// --- Order Endpoints ---
export const createOrderApi = async (paymentMethod = 'CASH') => {
  const response = await api.post('/orders', { paymentMethod });
  return response.data;
};

export const createMomoPaymentApi = async () => {
  const response = await api.post('/payment/momo/create');
  return response.data;
};

// --- Admin Endpoints ---
export const getAllOrdersApi = async () => {
  const response = await api.get('/orders');
  return response.data;
};



export const updateOrderStatusApi = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductApi = async (productId, productData) => {
  const response = await api.patch(`/products/${productId}`, productData);
  return response.data;
};

export const deleteProductApi = async (productId) => {
  const response = await api.delete(`/products/${productId}`);
  return response.data;
};

export const createCategoryApi = async (categoryData) => {
  const response = await api.post('/categories', categoryData);
  return response.data;
};

export const updateCategoryApi = async (categoryId, categoryData) => {
  const response = await api.patch(`/categories/${categoryId}`, categoryData);
  return response.data;
};

export const deleteCategoryApi = async (categoryId) => {
  const response = await api.delete(`/categories/${categoryId}`);
  return response.data;
};

export default api;
