const SoilReading = require("../models/soilReading");
const generateAIInsights = require("../utils/aiInsights");
const fetchWeatherData = require("../utils/weatherService");

/**
 * ✅ Create a new soil reading (manual or from sensors)
 */
exports.createReading = async (req, res) => {
  try {
    const { userId, location, soilData } = req.body;

    if (!userId || !location || !soilData) {
      return res.status(400).json({ error: "Missing required fields: userId, location, or soilData." });
    }

    console.log("📥 Incoming soil reading:", req.body);

    // Try fetching weather only if coordinates exist
    let weatherData = null;
    if (location.latitude && location.longitude) {
      try {
        weatherData = await fetchWeatherData(location.latitude, location.longitude);
      } catch (weatherErr) {
        console.warn("⚠️ Weather fetch failed:", weatherErr.message);
      }
    }

    // Generate insights and recommendations
    const { insights, recommendations } = generateAIInsights(soilData, weatherData);

    // Save the reading
    const reading = new SoilReading({
      userId,
      location,
      soilData,
      weatherData,
      aiInsights: insights,
      recommendations,
    });

    await reading.save();
    console.log(`✅ Soil reading saved successfully for user ${userId}`);

    res.status(201).json({
      message: "New soil reading added successfully",
      reading,
    });
  } catch (err) {
    console.error("❌ Error creating soil reading:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Get all readings for a specific user
 */
exports.getUserReadings = async (req, res) => {
  try {
    const { userId } = req.params;
    const readings = await SoilReading.find({ userId }).sort({ timestamp: -1 });
    res.json(readings);
  } catch (err) {
    console.error(`❌ Error fetching readings for user ${req.params.userId}:`, err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * ✅ Get a single reading by ID
 */
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

/**
 * ✅ Compute aggregated statistics for a user
 */
exports.getStatistics = async (req, res) => {
  try {
    const { userId } = req.params;
    const readings = await SoilReading.find({ userId });

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

/**
 * 🧪 Optional: Get all readings (for admin/debugging)
 */
exports.getAllReadings = async (req, res) => {
  try {
    const readings = await SoilReading.find().sort({ createdAt: -1 });
    res.json(readings);
  } catch (err) {
    console.error("❌ Error fetching all readings:", err);
    res.status(500).json({ error: err.message });
  }
};
