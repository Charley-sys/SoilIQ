const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const soilRoutes = require("./routes/soilRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/soil", soilRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client", "client", "build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

console.log("🌍 Attempting to connect to MongoDB...");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
.then(() => {
  console.log("✅ MongoDB connected successfully");
  app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});
