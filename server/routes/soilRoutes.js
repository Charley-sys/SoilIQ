// server/routes/soilRoutes.js
const express = require("express");
const router = express.Router();
const soilController = require("../controllers/soilController");

// ✅ Create a new soil reading (manual or sensor input)
router.post("/soil-readings", soilController.createReading);

// ✅ Get all readings for a specific user
router.get("/soil-readings/:userId", soilController.getUserReadings);

// ✅ Get details of a single reading by ID
router.get("/soil-readings/detail/:id", soilController.getReadingDetail);

// ✅ Get aggregated statistics for a user (used in dashboard)
router.get("/statistics/:userId", soilController.getStatistics);

// ✅ Optional: Get all readings (for admin/testing)
router.get("/soil-readings", soilController.getAllReadings);

module.exports = router;
