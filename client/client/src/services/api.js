import axios from "axios";

// ✅ Backend base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api/soil",
});

// Create a new soil reading
export const createSoilReading = async (data) => {
  const res = await api.post("/soil-readings", data);
  return res.data;
};

// Get all readings for a user
export const getUserReadings = async (userId) => {
  const res = await api.get(`/soil-readings/${userId}`);
  return res.data;
};

// Get a single reading by ID
export const getReadingDetail = async (id) => {
  const res = await api.get(`/soil-readings/detail/${id}`);
  return res.data;
};

// Get aggregated statistics for a user (used in Dashboard)
export const getStatistics = async (userId) => {
  const res = await api.get(`/statistics/${userId}`);
  return res.data;
};

// Optional: get statistics for all users (backend route needed)
export const getAllStatistics = async () => {
  const res = await api.get(`/statistics`);
  return res.data;
};

export default api;
