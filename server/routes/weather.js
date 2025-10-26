const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

// Get current weather for farm location
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        status: 'error',
        message: 'Latitude and longitude are required'
      });
    }

    // Mock weather data - replace with actual weather API integration
    const mockWeatherData = {
      location: {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon)
      },
      current: {
        temperature: 22.5,
        feelsLike: 24.0,
        humidity: 65,
        windSpeed: 3.2,
        windDirection: 180,
        precipitation: 0.0,
        condition: 'Partly Cloudy',
        icon: 'partly-cloudy-day',
        pressure: 1013,
        uvIndex: 4,
        visibility: 10,
        timestamp: new Date().toISOString()
      },
      forecast: [
        { 
          day: 'Today', 
          high: 24, 
          low: 16, 
          condition: 'Partly Cloudy', 
          icon: 'partly-cloudy-day',
          precipitation: 10 
        },
        { 
          day: 'Tomorrow', 
          high: 26, 
          low: 17, 
          condition: 'Sunny', 
          icon: 'clear-day',
          precipitation: 0 
        },
        { 
          day: 'Wed', 
          high: 23, 
          low: 15, 
          condition: 'Rain', 
          icon: 'rain',
          precipitation: 80 
        }
      ]
    };

    res.status(200).json({
      status: 'success',
      data: mockWeatherData
    });
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weather data'
    });
  }
});

// Get weather alerts
router.get('/alerts', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    // Mock alerts - replace with actual alert service
    const mockAlerts = [
      {
        id: 1,
        type: 'frost',
        severity: 'warning',
        title: 'Frost Advisory',
        description: 'Temperatures expected to drop below freezing overnight.',
        startTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours from now
        endTime: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(), // 18 hours from now
        instructions: 'Protect sensitive crops with covers or move potted plants indoors.'
      }
    ];

    res.status(200).json({
      status: 'success',
      data: {
        alerts: mockAlerts,
        location: { lat: parseFloat(lat), lon: parseFloat(lon) },
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Weather alerts error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching weather alerts'
    });
  }
});

module.exports = router;