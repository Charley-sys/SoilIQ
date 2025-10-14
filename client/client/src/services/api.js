import axios from "axios";

// ✅ Dynamic backend URL (works locally & after deployment)
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "http://localhost:5000/api", // ✅ points to backend base (not /soil)
});

// 🌱 SOIL DATA ENDPOINTS

// ➕ Create a new soil reading
export const addSoilReading = async (data) => {
  try {
    const res = await api.post("/soil/soil-readings", data);
    return res.data;
  } catch (err) {
    console.error("❌ Error adding soil reading:", err.response?.data || err.message);
    throw err;
  }
};

// 📋 Get all readings for a user
export const getUserReadings = async (userId) => {
  const res = await api.get(`/soil/soil-readings/${userId}`);
  return res.data;
};

// 🔍 Get a single reading by ID
export const getReadingDetail = async (id) => {
  const res = await api.get(`/soil/soil-readings/detail/${id}`);
  return res.data;
};

// 📊 Get aggregated statistics for a user (used in Dashboard)
export const getStatistics = async (userId) => {
  const res = await api.get(`/soil/statistics/${userId}`);
  return res.data;
};

// 🌍 Optional: get statistics for all users (backend route needed)
export const getAllStatistics = async () => {
  const res = await api.get(`/soil/statistics`);
  return res.data;
};

export default api;
