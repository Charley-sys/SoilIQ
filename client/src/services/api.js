import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const soilAPI = {
  getAll: () => api.get('/soil'),
  create: (data) => api.post('/soil', data),
  getById: (id) => api.get(`/soil/${id}`),
  update: (id, data) => api.patch(`/soil/${id}`, data),
  delete: (id) => api.delete(`/soil/${id}`),
};

export const weatherAPI = {
  getCurrent: () => api.get('/weather'),
  getAlerts: () => api.get('/weather/alerts'),
  getHistorical: (days = 7) => api.get(`/weather/historical?days=${days}`),
};

export default api;