// server/routes/soilRoutes.js
const express = require("express");
const router = express.Router();
const soilController = require("../controllers/soilController");

// Create a new soil reading
router.post("/soil-readings", soilController.createReading);

// Get all readings for a specific user
router.get("/soil-readings/:userId", soilController.getUserReadings);

// Get details of a single reading
router.get("/soil-readings/detail/:id", soilController.getReadingDetail);

// Get aggregated statistics for a user
router.get("/statistics/:userId", soilController.getStatistics);

module.exports = router;
