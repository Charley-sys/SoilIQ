// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const clientPath = path.join(__dirname, "../client/client/build");

// Import routes
const soilRoutes = require("./routes/soilRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Base route for quick health check
app.get("/", (req, res) => {
  res.send("🌱 SoilIQ API is running...");
});

// ✅ API routes
app.use("/api/soil", soilRoutes);

// ✅ Serve React Frontend (Production Build)
if (process.env.NODE_ENV === "production") {
  const clientPath = path.join(__dirname, "../client/build");
  app.use(express.static(clientPath));

  // Handle React routing, return all requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(clientPath, "index.html"));
  });
}

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/soiliq";
const PORT = process.env.PORT || 5000;

console.log("🌍 Connecting to MongoDB...");

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // better error handling
  })
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at: http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
