// Fix: Use consistent variable name
const API_BASE_URL = 'https://soiliq-server.onrender.com';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('soilIQToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {  // ADD /api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {  // ADD /api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {  // ADD /api
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return response.json();
  },
};

export const soilAPI = {
  createReading: async (readingData) => {
    const response = await fetch(`${API_BASE_URL}/api/soil/readings`, {  // ADD /api
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(readingData),
    });
    return response.json();
  },

  getReadings: async () => {
    const response = await fetch(`${API_BASE_URL}/api/soil/readings`, {  // ADD /api
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return response.json();
  },

  getAnalysis: async (days = 30) => {
    const response = await fetch(`${API_BASE_URL}/api/soil/analysis?days=${days}`, {  // ADD /api
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return response.json();
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/soil/stats`, {  // ADD /api
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });
    return response.json();
  },
};