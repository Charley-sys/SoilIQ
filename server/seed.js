// server/seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const SoilReading = require("./models/soilReading");

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function seed() {
  try {
    // Optional: clear existing test data for user123
    await SoilReading.deleteMany({ userId: "user123" });

    const reading = new SoilReading({
      userId: "user123",
      location: {
        latitude: 1.234,
        longitude: 36.789,
        name: "Demo Farm",
      },
      soilData: {
        pH: 6.5,
        nitrogen: 25,
        phosphorus: 20,
        potassium: 180,
        organicMatter: 4,
        moisture: 20,
        texture: "loam",
      },
      timestamp: new Date(),
      weatherData: {
        temperature: 28,
        humidity: 60,
        rainfall: 10,
        windSpeed: 5,
      },
      aiInsights: "Soil pH is optimal. Nitrogen levels are sufficient.",
      recommendations: ["Monitor soil conditions regularly."],
    });

    await reading.save();
    console.log("✅ Test soil reading inserted successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error inserting seed data:", err);
    process.exit(1);
  }
}

seed();
