const axios = require('axios');

// @desc    Get weather data for location
// @route   GET /api/weather
// @access  Private
exports.getWeather = async (req, res) => {
  try {
    console.log('Fetching weather data...');
    
    const mockWeatherData = {
      location: "Nairobi, Kenya",
      temperature: 22.5,
      humidity: 65,
      precipitation: 10,
      windSpeed: 15,
      conditions: "Partly Cloudy",
      forecast: [
        { day: "Today", high: 24, low: 18, condition: "Partly Cloudy" },
        { day: "Tomorrow", high: 25, low: 19, condition: "Sunny" },
        { day: "Day 3", high: 23, low: 17, condition: "Light Rain" }
      ],
      soilConditions: {
        moisture: "Optimal",
        temperature: "Good for planting",
        recommendation: "Ideal conditions for most crops"
      },
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: {
        weather: mockWeatherData
      }
    });
  } catch (error) {
    console.error('Weather error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch weather data'
    });
  }
};

// @desc    Get weather alerts
// @route   GET /api/weather/alerts
// @access  Private
exports.getWeatherAlerts = async (req, res) => {
  try {
    const mockAlerts = {
      alerts: [
        {
          type: "rain",
          severity: "moderate",
          message: "Light rainfall expected in the next 24 hours",
          startTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
          endTime: new Date(Date.now() + 30 * 60 * 60 * 1000)
        }
      ],
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: mockAlerts
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch weather alerts'
    });
  }
};

// @desc    Get historical weather data
// @route   GET /api/weather/historical
// @access  Private
exports.getHistoricalWeather = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    
    const mockHistoricalData = {
      period: `${days} days`,
      averageTemperature: 21.8,
      totalRainfall: 45.2,
      soilMoistureTrend: "stable",
      data: Array.from({ length: parseInt(days) }, (_, i) => ({
        date: new Date(Date.now() - (parseInt(days) - i - 1) * 24 * 60 * 60 * 1000),
        temperature: (20 + Math.random() * 5).toFixed(1),
        rainfall: (Math.random() * 10).toFixed(1),
        soilMoisture: (60 + Math.random() * 20).toFixed(1)
      })),
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: mockHistoricalData
    });
  } catch (error) {
    console.error('Historical weather error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch historical weather data'
    });
  }
};