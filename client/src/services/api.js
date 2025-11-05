// services/api.js
import axios from 'axios';

// Create axios instance with base config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const soilAPI = {
  getAll: () => api.get('/soil'),
  create: (data) => api.post('/soil-readings', data),
};

export const weatherAPI = {
  getCurrent: () => api.get('/weather'),
};

export const farmsAPI = {
  create: (data) => api.post('/farms', data),
  getAll: () => api.get('/farms'),
};

export default api;