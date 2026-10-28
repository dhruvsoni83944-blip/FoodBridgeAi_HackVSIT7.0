import axios from 'axios';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.PROD) {
    // In production without explicit URL, relative /api leverages reverse proxy / same origin
    return '/api';
  }
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Attach JWT token to requests if present in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('fb_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent response data handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear token
    if (error.response && error.response.status === 401) {
      // Don't auto-clear if it was a login attempt failure
      if (!error.config.url.includes('/auth/login')) {
        localStorage.removeItem('fb_jwt_token');
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me')
};

export const adminAPI = {
  getUsers: (params = {}) => api.get('/users', { params }),
  getDonations: (params = {}) => api.get('/admin/donations', { params }),
  getDeliveries: (params = {}) => api.get('/admin/deliveries', { params }),
  getStatistics: () => api.get('/admin/statistics'),
  verifyUser: (userId, isVerified = true) => api.patch(`/admin/users/${userId}/verify`, { isVerified })
};

export const foodQualityAPI = {
  analyze: (formDataOrJson) => {
    const isFormData = typeof FormData !== 'undefined' && formDataOrJson instanceof FormData;
    return api.post('/food-quality/analyze', formDataOrJson, {
      headers: isFormData ? { 'Content-Type': undefined } : { 'Content-Type': 'application/json' },
      timeout: 35000
    });
  },
  getInspections: (params = {}) => api.get('/food-quality/inspections', { params })
};

export const userAPI = adminAPI;


export default api;
