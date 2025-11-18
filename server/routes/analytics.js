const express = require('express');
const analyticsController = require('../controllers/analyticsController');
// Remove authController import since we don't need protection anymore

const router = express.Router();

// Remove this line: router.use(authController.protect);

// Comprehensive analysis - now accessible without login
router.get('/comprehensive/:farmId', analyticsController.getComprehensiveAnalysis);

// Comparative analysis across multiple farms
router.get('/comparative', analyticsController.getComparativeAnalysis);

// Historical trends for specific parameters
router.get('/historical/:farmId', analyticsController.getHistoricalTrends);

// Export analytics data
router.get('/export/:farmId', analyticsController.exportAnalyticsData);

// Add a demo endpoint for immediate access
router.get('/demo-analysis', analyticsController.getDemoAnalysis);

module.exports = router;