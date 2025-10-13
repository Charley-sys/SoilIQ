// server/models/SoilReading.js
const mongoose = require("mongoose");

const soilReadingSchema = new mongoose.Schema({
  userId: String,
  location: {
    latitude: Number,
    longitude: Number,
    name: String,
  },
  soilData: {
    pH: Number,
    nitrogen: Number,
    phosphorus: Number,
    potassium: Number,
    organicMatter: Number,
    moisture: Number,
    texture: String,
  },
  timestamp: { type: Date, default: Date.now },
  weatherData: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number,
  },
  aiInsights: String,
  recommendations: [String],
});

module.exports = mongoose.model("SoilReading", soilReadingSchema);
