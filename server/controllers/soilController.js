// server/controllers/soilController.js
const SoilReading = require("../models/soilReading");
const generateAIInsights = require("../utils/aiInsights");
const fetchWeatherData = require("../utils/weatherService");

// ✅ Create a new soil reading
exports.createReading = async (req, res) => {
  try {
    const { userId, location, soilData } = req.body;

    if (!userId || !location || !soilData) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Fetch live weather data based on coordinates
    const weatherData = await fetchWeatherData(location.latitude, location.longitude);

    // Generate AI insights and recommendations
    const { insights, recommendations } = generateAIInsights(soilData, weatherData);

    // Save reading
    const reading = new SoilReading({
      userId,
      location,
      soilData,
      weatherData,
      aiInsights: insights,
      recommendations,
    });

    await reading.save();
    console.log(`✅ Soil reading saved for user ${userId}`);
    res.status(201).json(reading);
  } catch (err) {
    console.error("❌ Error creating soil reading:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all readings for a user
exports.getUserReadings = async (req, res) => {
  try {
    const readings = await SoilReading.find({ userId: req.params.userId })
      .sort({ timestamp: -1 });

    res.json(readings);
  } catch (err) {
    console.error(`❌ Error fetching readings for user ${req.params.userId}:`, err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get a single reading by ID
exports.getReadingDetail = async (req, res) => {
  try {
    const reading = await SoilReading.findById(req.params.id);

    if (!reading) {
      return res.status(404).json({ error: "Reading not found." });
    }

    res.json(reading);
  } catch (err) {
    console.error(`❌ Error fetching reading ${req.params.id}:`, err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get aggregated statistics for a user
exports.getStatistics = async (req, res) => {
  try {
    const readings = await SoilReading.find({ userId: req.params.userId });

    if (!readings.length) {
      return res.json({
        totalReadings: 0,
        avgPH: 0,
        avgNitrogen: 0,
        avgMoisture: 0,
        lastReading: null,
      });
    }

    const avg = (key) =>
      readings.reduce((sum, r) => sum + (r.soilData[key] || 0), 0) / readings.length;

    res.json({
      totalReadings: readings.length,
      avgPH: avg("pH").toFixed(2),
      avgNitrogen: avg("nitrogen").toFixed(2),
      avgMoisture: avg("moisture").toFixed(2),
      lastReading: readings[0],
    });
  } catch (err) {
    console.error(`❌ Error computing statistics for user ${req.params.userId}:`, err);
    res.status(500).json({ error: err.message });
  }
};
