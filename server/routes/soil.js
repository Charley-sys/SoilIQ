// server/routes/soil.js
const express = require('express');
const {
  createSoilReading,
  getSoilReadings,
  getSoilReading,
  getSoilAnalysis,
  getSoilStats
} = require('../controllers/soilController');
const { protect } = require('../middleware/auth');
const { validateSoilReading } = require('../middleware/validation');

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/readings', validateSoilReading, createSoilReading);
router.get('/readings', getSoilReadings);
router.get('/readings/:id', getSoilReading);
router.get('/analysis', getSoilAnalysis);
router.get('/stats', getSoilStats);

module.exports = router;