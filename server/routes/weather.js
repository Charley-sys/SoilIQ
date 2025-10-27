const express = require('express');
const weatherController = require('../controllers/weatherController');
const authController = require('../controllers/authController');

const router = express.Router();

// Protect all routes
router.use(authController.protect);

// Weather routes
router.get('/', weatherController.getWeather);
router.get('/alerts', weatherController.getWeatherAlerts);
router.get('/historical', weatherController.getHistoricalWeather);

module.exports = router;