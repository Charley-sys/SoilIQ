const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Comprehensive analysis
router.get('/comprehensive/:farmId', analyticsController.getComprehensiveAnalysis);

// Comparative analysis across multiple farms
router.get('/comparative', analyticsController.getComparativeAnalysis);

// Historical trends for specific parameters
router.get('/historical/:farmId', analyticsController.getHistoricalTrends);

// Export analytics data
router.get('/export/:farmId', analyticsController.exportAnalyticsData);

module.exports = router;