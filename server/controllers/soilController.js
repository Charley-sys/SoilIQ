const SoilReading = require('../models/soilReading');
const Farm = require('../models/Farm');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');
const { notifySoilReadingChange, getWebSocketServer } = require('../middleware/websocketIntegration');

// AI Recommendation Engine
const generateRecommendations = (soilData, averages, trends) => {
  const recommendations = [];
  const alerts = [];

  // pH-based recommendations
  if (averages.pH < 5.5) {
    recommendations.push({
      type: 'pH',
      priority: 'high',
      title: 'Low pH Detected',
      message: 'Soil is too acidic. Consider adding lime to raise pH level.',
      action: 'Add agricultural lime at 2-4 tons per hectare',
      timing: 'Before next planting season',
      impact: 'high'
    });
  } else if (averages.pH > 7.5) {
    recommendations.push({
      type: 'pH',
      priority: 'high',
      title: 'High pH Detected',
      message: 'Soil is too alkaline. Consider adding sulfur or organic matter.',
      action: 'Add elemental sulfur or acidic organic matter',
      timing: '4-6 weeks before planting',
      impact: 'high'
    });
  }

  // Nutrient-based recommendations
  if (averages.nitrogen < 30) {
    recommendations.push({
      type: 'nutrient',
      priority: 'medium',
      title: 'Low Nitrogen Levels',
      message: 'Nitrogen levels are below optimal for most crops.',
      action: 'Apply nitrogen-rich fertilizer (Urea, Ammonium Nitrate)',
      timing: 'Within 2 weeks',
      impact: 'medium'
    });
  }

  if (averages.phosphorus < 20) {
    recommendations.push({
      type: 'nutrient',
      priority: 'medium',
      title: 'Low Phosphorus Levels',
      message: 'Phosphorus deficiency detected.',
      action: 'Apply phosphorus fertilizer (DAP, Superphosphate)',
      timing: 'During planting',
      impact: 'medium'
    });
  }

  if (averages.potassium < 40) {
    recommendations.push({
      type: 'nutrient',
      priority: 'medium',
      title: 'Low Potassium Levels',
      message: 'Potassium levels need improvement.',
      action: 'Apply potassium fertilizer (MOP, SOP)',
      timing: 'Before flowering stage',
      impact: 'medium'
    });
  }

  // Moisture-based recommendations
  if (averages.moisture < 25) {
    alerts.push({
      type: 'alert',
      priority: 'high',
      title: 'Critical Soil Moisture',
      message: 'Soil is too dry. Immediate irrigation needed.',
      action: 'Irrigate immediately',
      timing: 'Now',
      impact: 'critical'
    });
  } else if (averages.moisture < 40) {
    recommendations.push({
      type: 'irrigation',
      priority: 'medium',
      title: 'Low Soil Moisture',
      message: 'Soil moisture is below optimal levels.',
      action: 'Increase irrigation frequency',
      timing: 'Within 3 days',
      impact: 'medium'
    });
  }

  // Organic matter recommendations
  if (averages.organicMatter < 2) {
    recommendations.push({
      type: 'soil_health',
      priority: 'low',
      title: 'Low Organic Matter',
      message: 'Soil organic matter needs improvement for long-term health.',
      action: 'Add compost, manure, or cover crops',
      timing: 'Next season',
      impact: 'long-term'
    });
  }

  // Trend-based alerts
  if (trends.pH && trends.pH.direction === 'down' && trends.pH.change < -0.5) {
    alerts.push({
      type: 'trend',
      priority: 'medium',
      title: 'Rapid pH Decrease',
      message: 'pH is decreasing rapidly. Monitor closely.',
      action: 'Test pH more frequently',
      timing: 'Monitor',
      impact: 'medium'
    });
  }

  return {
    recommendations,
    alerts,
    summary: {
      totalRecommendations: recommendations.length,
      criticalAlerts: alerts.filter(a => a.priority === 'high').length,
      overallPriority: recommendations.length > 0 ? 'medium' : 'low'
    }
  };
};

// Calculate soil health score
const calculateHealthScore = (averages) => {
  let score = 0;
  let factors = 0;

  // pH Score (optimal: 6.0-7.0)
  if (averages.pH >= 6.0 && averages.pH <= 7.0) {
    score += 100;
  } else if (averages.pH >= 5.5 && averages.pH <= 7.5) {
    score += 70;
  } else {
    score += 30;
  }
  factors++;

  // Nutrient Score (average of N, P, K)
  const nutrientAvg = (averages.nitrogen + averages.phosphorus + averages.potassium) / 3;
  if (nutrientAvg >= 40 && nutrientAvg <= 80) {
    score += 100;
  } else if (nutrientAvg >= 20 && nutrientAvg <= 100) {
    score += 70;
  } else {
    score += 30;
  }
  factors++;

  // Moisture Score (optimal: 40-60%)
  if (averages.moisture >= 40 && averages.moisture <= 60) {
    score += 100;
  } else if (averages.moisture >= 25 && averages.moisture <= 75) {
    score += 70;
  } else {
    score += 30;
  }
  factors++;

  // Organic Matter Score (optimal: 3-5%)
  if (averages.organicMatter >= 3 && averages.organicMatter <= 5) {
    score += 100;
  } else if (averages.organicMatter >= 2 && averages.organicMatter <= 6) {
    score += 70;
  } else {
    score += 30;
  }
  factors++;

  return Math.round(score / factors);
};

// Helper function to calculate health score for WebSocket notifications
const calculateHealthScoreForFarm = async (userId, farmId, days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));

  const averages = await SoilReading.aggregate([
    {
      $match: {
        farm: mongoose.Types.ObjectId(farmId),
        user: mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        avgPH: { $avg: '$pH' },
        avgNitrogen: { $avg: '$nitrogen' },
        avgPhosphorus: { $avg: '$phosphorus' },
        avgPotassium: { $avg: '$potassium' },
        avgMoisture: { $avg: '$moisture' },
        avgOrganicMatter: { $avg: '$organicMatter' }
      }
    }
  ]);

  if (!averages[0]) {
    return null;
  }

  const avgData = {
    pH: parseFloat(averages[0].avgPH.toFixed(2)),
    nitrogen: parseFloat(averages[0].avgNitrogen.toFixed(2)),
    phosphorus: parseFloat(averages[0].avgPhosphorus.toFixed(2)),
    potassium: parseFloat(averages[0].avgPotassium.toFixed(2)),
    moisture: parseFloat(averages[0].avgMoisture.toFixed(2)),
    organicMatter: parseFloat(averages[0].avgOrganicMatter.toFixed(2))
  };

  const healthScore = calculateHealthScore(avgData);

  return {
    healthScore,
    averages: avgData,
    rating: healthScore >= 80 ? 'excellent' : 
            healthScore >= 60 ? 'good' : 
            healthScore >= 40 ? 'fair' : 'poor',
    lastUpdated: new Date().toISOString()
  };
};

// Notify health score update via WebSocket
const notifyHealthScoreUpdate = async (userId, farmId) => {
  try {
    const healthScoreData = await calculateHealthScoreForFarm(userId, farmId);
    if (healthScoreData) {
      const webSocketServer = getWebSocketServer();
      webSocketServer.notifyHealthScoreUpdate(userId, farmId, healthScoreData);
    }
  } catch (error) {
    console.error('Error notifying health score update:', error);
  }
};

// Check for critical alerts and notify via WebSocket
const checkAndNotifyAlerts = async (userId, farmId, soilReading) => {
  try {
    const healthScoreData = await calculateHealthScoreForFarm(userId, farmId, 7); // Last 7 days
    if (!healthScoreData) return;

    const alerts = [];

    // Critical pH alert
    if (healthScoreData.averages.pH < 4.5 || healthScoreData.averages.pH > 9.0) {
      alerts.push({
        type: 'critical',
        title: 'Critical pH Level',
        message: `pH level is critically ${healthScoreData.averages.pH < 4.5 ? 'low' : 'high'} (${healthScoreData.averages.pH}). Immediate action required.`,
        parameter: 'pH',
        value: healthScoreData.averages.pH,
        timestamp: new Date().toISOString()
      });
    }

    // Critical moisture alert
    if (healthScoreData.averages.moisture < 15) {
      alerts.push({
        type: 'critical',
        title: 'Critical Soil Moisture',
        message: `Soil moisture is critically low (${healthScoreData.averages.moisture}%). Immediate irrigation required.`,
        parameter: 'moisture',
        value: healthScoreData.averages.moisture,
        timestamp: new Date().toISOString()
      });
    }

    // Send alerts via WebSocket
    if (alerts.length > 0) {
      const webSocketServer = getWebSocketServer();
      alerts.forEach(alert => {
        webSocketServer.sendAlert(userId, alert);
      });
    }
  } catch (error) {
    console.error('Error checking and notifying alerts:', error);
  }
};

exports.getAllSoilReadings = async (req, res) => {
  try {
    const features = new APIFeatures(SoilReading.find({ user: req.user.id }), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const soilReadings = await features.query;
    const total = await SoilReading.countDocuments({ user: req.user.id });

    res.status(200).json({
      status: 'success',
      results: soilReadings.length,
      data: {
        soilReadings,
        total,
        page: parseInt(req.query.page) || 1,
        pages: Math.ceil(total / (parseInt(req.query.limit) || 10))
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching soil readings'
    });
  }
};

exports.getFarmSoilReadings = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { startDate, endDate, includeAverages, includeTrends } = req.query;

    // Build query
    let query = { farm: farmId, user: req.user.id };
    
    // Date range filter
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const soilReadings = await SoilReading.find(query)
      .sort({ createdAt: -1 })
      .populate('farm', 'name location');

    let responseData = { soilReadings };

    // Include averages if requested
    if (includeAverages === 'true') {
      const averages = await SoilReading.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            avgPH: { $avg: '$pH' },
            avgNitrogen: { $avg: '$nitrogen' },
            avgPhosphorus: { $avg: '$phosphorus' },
            avgPotassium: { $avg: '$potassium' },
            avgMoisture: { $avg: '$moisture' },
            avgOrganicMatter: { $avg: '$organicMatter' },
            avgTemperature: { $avg: '$temperature' },
            count: { $sum: 1 }
          }
        }
      ]);

      responseData.averages = averages[0] ? {
        pH: parseFloat(averages[0].avgPH.toFixed(2)),
        nitrogen: parseFloat(averages[0].avgNitrogen.toFixed(2)),
        phosphorus: parseFloat(averages[0].avgPhosphorus.toFixed(2)),
        potassium: parseFloat(averages[0].avgPotassium.toFixed(2)),
        moisture: parseFloat(averages[0].avgMoisture.toFixed(2)),
        organicMatter: parseFloat(averages[0].avgOrganicMatter.toFixed(2)),
        temperature: parseFloat(averages[0].avgTemperature.toFixed(2)),
        totalReadings: averages[0].count
      } : null;
    }

    // Include trends if requested
    if (includeTrends === 'true' && soilReadings.length > 1) {
      const sortedReadings = [...soilReadings].sort((a, b) => 
        new Date(a.createdAt) - new Date(b.createdAt)
      );

      const firstReading = sortedReadings[0];
      const lastReading = sortedReadings[sortedReadings.length - 1];

      const trends = {};
      const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];

      parameters.forEach(param => {
        if (firstReading[param] && lastReading[param]) {
          const change = ((lastReading[param] - firstReading[param]) / firstReading[param]) * 100;
          trends[param] = {
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
            percentage: Math.abs(parseFloat(change.toFixed(1))),
            change: parseFloat((lastReading[param] - firstReading[param]).toFixed(2)),
            description: `Trending ${change > 0 ? 'up' : 'down'} by ${Math.abs(parseFloat(change.toFixed(1)))}%`
          };
        }
      });

      responseData.trends = trends;
    }

    res.status(200).json({
      status: 'success',
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching farm soil readings:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching soil readings'
    });
  }
};

exports.createSoilReading = async (req, res) => {
  try {
    // Add user to request body
    req.body.user = req.user.id;

    // Validate farm belongs to user
    if (req.body.farm) {
      const farm = await Farm.findOne({ _id: req.body.farm, user: req.user.id });
      if (!farm) {
        return res.status(404).json({
          status: 'error',
          message: 'Farm not found or access denied'
        });
      }
    }

    const soilReading = await SoilReading.create(req.body);

    // Populate farm details
    await soilReading.populate('farm', 'name location cropType');

    // Notify via WebSocket
    notifySoilReadingChange('created', req.user.id, soilReading);

    // Calculate and notify health score update
    await notifyHealthScoreUpdate(req.user.id, soilReading.farm._id);

    // Check for critical alerts
    await checkAndNotifyAlerts(req.user.id, soilReading.farm._id, soilReading);

    res.status(201).json({
      status: 'success',
      data: {
        soilReading
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error creating soil reading'
    });
  }
};

exports.updateSoilReading = async (req, res) => {
  try {
    const soilReading = await SoilReading.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    ).populate('farm', 'name location cropType');

    if (!soilReading) {
      return res.status(404).json({
        status: 'error',
        message: 'Soil reading not found'
      });
    }

    // Notify via WebSocket
    notifySoilReadingChange('updated', req.user.id, soilReading);

    // Calculate and notify health score update
    if (soilReading.farm) {
      await notifyHealthScoreUpdate(req.user.id, soilReading.farm._id);
    }

    res.status(200).json({
      status: 'success',
      data: {
        soilReading
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'Error updating soil reading'
    });
  }
};

exports.deleteSoilReading = async (req, res) => {
  try {
    const soilReading = await SoilReading.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!soilReading) {
      return res.status(404).json({
        status: 'error',
        message: 'Soil reading not found'
      });
    }

    // Notify via WebSocket
    notifySoilReadingChange('deleted', req.user.id, soilReading);

    // Calculate and notify health score update if farm exists
    if (soilReading.farm) {
      await notifyHealthScoreUpdate(req.user.id, soilReading.farm);
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting soil reading'
    });
  }
};

exports.getSoilReading = async (req, res) => {
  try {
    const soilReading = await SoilReading.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('farm', 'name location cropType');

    if (!soilReading) {
      return res.status(404).json({
        status: 'error',
        message: 'Soil reading not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        soilReading
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching soil reading'
    });
  }
};

exports.getHealthScore = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { days = 30 } = req.query;

    const healthScoreData = await calculateHealthScoreForFarm(req.user.id, farmId, days);

    if (!healthScoreData) {
      return res.status(404).json({
        status: 'error',
        message: 'No soil data found for the specified period'
      });
    }

    res.status(200).json({
      status: 'success',
      data: healthScoreData
    });
  } catch (error) {
    console.error('Error calculating health score:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error calculating soil health score'
    });
  }
};

exports.getRecommendations = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get averages
    const averagesResult = await SoilReading.aggregate([
      {
        $match: {
          farm: mongoose.Types.ObjectId(farmId),
          user: mongoose.Types.ObjectId(req.user.id),
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          avgPH: { $avg: '$pH' },
          avgNitrogen: { $avg: '$nitrogen' },
          avgPhosphorus: { $avg: '$phosphorus' },
          avgPotassium: { $avg: '$potassium' },
          avgMoisture: { $avg: '$moisture' },
          avgOrganicMatter: { $avg: '$organicMatter' }
        }
      }
    ]);

    if (!averagesResult[0]) {
      return res.status(404).json({
        status: 'error',
        message: 'No soil data found for recommendations'
      });
    }

    const averages = {
      pH: parseFloat(averagesResult[0].avgPH.toFixed(2)),
      nitrogen: parseFloat(averagesResult[0].avgNitrogen.toFixed(2)),
      phosphorus: parseFloat(averagesResult[0].avgPhosphorus.toFixed(2)),
      potassium: parseFloat(averagesResult[0].avgPotassium.toFixed(2)),
      moisture: parseFloat(averagesResult[0].avgMoisture.toFixed(2)),
      organicMatter: parseFloat(averagesResult[0].avgOrganicMatter.toFixed(2))
    };

    // Get trends
    const readings = await SoilReading.find({
      farm: farmId,
      user: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    let trends = {};
    if (readings.length > 1) {
      const first = readings[0];
      const last = readings[readings.length - 1];
      
      ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'].forEach(param => {
        if (first[param] && last[param]) {
          const change = ((last[param] - first[param]) / first[param]) * 100;
          trends[param] = {
            direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
            percentage: Math.abs(parseFloat(change.toFixed(1)))
          };
        }
      });
    }

    // Generate recommendations
    const recommendations = generateRecommendations(readings, averages, trends);

    res.status(200).json({
      status: 'success',
      data: {
        recommendations,
        averages,
        trends,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating recommendations'
    });
  }
};

// Additional WebSocket-enabled methods
exports.getFarmAverages = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { days = 30 } = req.query;

    const healthScoreData = await calculateHealthScoreForFarm(req.user.id, farmId, days);

    if (!healthScoreData) {
      return res.status(404).json({
        status: 'error',
        message: 'No data found for the specified farm and period'
      });
    }

    res.status(200).json({
      status: 'success',
      data: healthScoreData
    });
  } catch (error) {
    console.error('Error fetching farm averages:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching farm averages'
    });
  }
};

exports.getFarmTrends = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const readings = await SoilReading.find({
      farm: farmId,
      user: req.user.id,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });

    if (readings.length < 2) {
      return res.status(404).json({
        status: 'error',
        message: 'Insufficient data for trend analysis'
      });
    }

    const trends = {};
    const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];

    parameters.forEach(param => {
      const first = readings[0][param];
      const last = readings[readings.length - 1][param];
      
      if (first != null && last != null) {
        const change = ((last - first) / first) * 100;
        trends[param] = {
          direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
          percentage: Math.abs(parseFloat(change.toFixed(1))),
          change: parseFloat((last - first).toFixed(2)),
          firstValue: first,
          lastValue: last
        };
      }
    });

    res.status(200).json({
      status: 'success',
      data: {
        trends,
        period: `${days} days`,
        totalReadings: readings.length
      }
    });
  } catch (error) {
    console.error('Error fetching farm trends:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching farm trends'
    });
  }
};

// Export the helper functions for use in other modules
exports.calculateHealthScoreForFarm = calculateHealthScoreForFarm;
exports.notifyHealthScoreUpdate = notifyHealthScoreUpdate;