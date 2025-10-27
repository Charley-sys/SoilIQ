const express = require('express');
const soilController = require('../controllers/soilController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Soil reading routes - FIXED METHOD NAMES
router.route('/')
  .get(soilController.getAllSoilReadings)  // ✅ Fixed
  .post(soilController.createSoilReading); // ✅ Fixed

router.route('/:id')
  .get(soilController.getSoilReading)      // ✅ Fixed
  .patch(soilController.updateSoilReading)
  .delete(soilController.deleteSoilReading);

// Farm-specific routes
router.get('/farm/:farmId', soilController.getFarmSoilReadings); // ✅ Fixed
router.get('/farm/:farmId/averages', soilController.getFarmAverages);
router.get('/farm/:farmId/trends', soilController.getFarmTrends);

// Analytics routes
router.get('/analytics/health-score/:farmId', soilController.getHealthScore);
router.get('/analytics/recommendations/:farmId', soilController.getRecommendations);
router.get('/analytics/comparison', soilController.getComparativeAnalysis);

// Export data
router.get('/export/:farmId', soilController.exportSoilData);

module.exports = router;