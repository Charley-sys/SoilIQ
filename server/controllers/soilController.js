// server/controllers/soilController.js

// Try to import models, but provide fallbacks if they don't exist
let SoilReading, Farm, SoilAI;

try {
  SoilReading = require('../models/soilReading');
} catch (error) {
  console.log('⚠️ SoilReading model not found, using demo mode');
  SoilReading = null;
}

try {
  Farm = require('../models/Farm');
} catch (error) {
  console.log('⚠️ Farm model not found, using demo mode');
  Farm = null;
}

try {
  SoilAI = require('../utils/aiEngine');
} catch (error) {
  console.log('⚠️ SoilAI engine not found, using fallback analysis');
  SoilAI = null;
}

// Fallback AI analysis
const fallbackAnalyzeSoil = (soilData) => {
  const { pH, nitrogen, phosphorus, potassium, temperature, moisture } = soilData;
  
  const healthScore = calculateHealthScore(pH, nitrogen, phosphorus, potassium, moisture);
  const recommendations = generateRecommendations(pH, nitrogen, phosphorus, potassium, moisture);
  
  return {
    healthScore,
    status: getStatus(healthScore),
    recommendations,
    urgency: getUrgency(healthScore),
    nutrientBalance: analyzeNutrients(nitrogen, phosphorus, potassium),
    isDemo: true
  };
};

exports.createSoilReading = async (req, res) => {
  try {
    console.log('🌱 Creating soil reading with data:', req.body);
    
    const {
      pH,
      nitrogen,
      phosphorus,
      potassium,
      temperature,
      moisture,
      location,
      cropType,
      season,
      weatherConditions,
      notes,
      farmId
    } = req.body;

    // Validate required fields
    if (!pH || !nitrogen || !phosphorus || !potassium) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: pH, nitrogen, phosphorus, potassium are required'
      });
    }

    // Generate AI analysis with fallback
    console.log('🤖 Generating AI analysis...');
    let analysis;
    if (SoilAI) {
      analysis = SoilAI.analyzeSoil({
        pH: parseFloat(pH),
        nitrogen: parseInt(nitrogen),
        phosphorus: parseInt(phosphorus),
        potassium: parseInt(potassium),
        temperature: temperature ? parseFloat(temperature) : null,
        moisture: moisture ? parseInt(moisture) : null
      });
    } else {
      analysis = fallbackAnalyzeSoil({
        pH: parseFloat(pH),
        nitrogen: parseInt(nitrogen),
        phosphorus: parseInt(phosphorus),
        potassium: parseInt(potassium),
        temperature: temperature ? parseFloat(temperature) : null,
        moisture: moisture ? parseInt(moisture) : null
      });
    }

    console.log('✅ AI analysis generated:', analysis);

    let soilReading;
    
    // Try to save to database, fallback to demo if models not available
    if (SoilReading) {
      soilReading = await SoilReading.create({
        user: req.user.id,
        farm: farmId,
        pH: parseFloat(pH),
        nitrogen: parseInt(nitrogen),
        phosphorus: parseInt(phosphorus),
        potassium: parseInt(potassium),
        temperature: temperature ? parseFloat(temperature) : null,
        moisture: moisture ? parseInt(moisture) : null,
        location,
        cropType,
        season,
        weatherConditions,
        notes,
        analysis,
        readingDate: new Date()
      });

      console.log('✅ Soil reading saved to database');
      
      // Try to populate user data
      try {
        await soilReading.populate('user', 'name email');
      } catch (populateError) {
        console.log('⚠️ Population failed, using basic data');
      }
    } else {
      // Demo mode - create response without database
      soilReading = {
        _id: 'demo-reading-' + Date.now(),
        user: {
          _id: req.user.id,
          name: req.user.name || 'Demo Farmer',
          email: req.user.email || 'demo@soiliq.com'
        },
        pH: parseFloat(pH),
        nitrogen: parseInt(nitrogen),
        phosphorus: parseInt(phosphorus),
        potassium: parseInt(potassium),
        temperature: temperature ? parseFloat(temperature) : null,
        moisture: moisture ? parseInt(moisture) : null,
        location: location || 'Demo Field',
        cropType: cropType || 'maize',
        analysis: analysis,
        readingDate: new Date(),
        createdAt: new Date(),
        isDemo: true
      };
      console.log('✅ Soil reading created in demo mode');
    }

    res.status(201).json({
      success: true,
      data: {
        soilReading
      },
      message: soilReading.isDemo ? 
        'Soil reading analyzed successfully (demo mode)' : 
        'Soil reading saved successfully'
    });

  } catch (error) {
    console.error('❌ Error creating soil reading:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create soil reading: ' + error.message,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
};

exports.getSoilReadings = async (req, res) => {
  try {
    // If no database model, return demo data
    if (!SoilReading) {
      return res.status(200).json({
        success: true,
        data: {
          readings: [
            {
              _id: 'demo-reading-1',
              pH: 6.8,
              nitrogen: 45,
              phosphorus: 20,
              potassium: 120,
              analysis: {
                healthScore: 72,
                status: 'Good',
                recommendations: ['Maintain current practices'],
                urgency: 'low'
              },
              readingDate: new Date(),
              isDemo: true
            }
          ],
          totalPages: 1,
          currentPage: 1,
          total: 1
        },
        message: 'Demo data - database not available'
      });
    }

    const { page = 1, limit = 10, sort = '-readingDate' } = req.query;

    const readings = await SoilReading.find({ user: req.user.id })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    const total = await SoilReading.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        readings,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSoilReading = async (req, res) => {
  try {
    if (!SoilReading) {
      return res.status(404).json({
        success: false,
        message: 'Soil reading not found - database not available'
      });
    }

    const soilReading = await SoilReading.findOne({
      _id: req.params.id,
      user: req.user.id
    }).populate('user', 'name email');

    if (!soilReading) {
      return res.status(404).json({
        success: false,
        message: 'Soil reading not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        soilReading
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSoilAnalysis = async (req, res) => {
  try {
    if (!SoilReading) {
      // Return demo analysis
      return res.status(200).json({
        success: true,
        data: {
          latestAnalysis: {
            healthScore: 75,
            status: 'Good',
            recommendations: ['Soil conditions are optimal'],
            urgency: 'low'
          },
          trends: [],
          stats: {
            averageHealthScore: 75,
            totalReadings: 0,
            dateRange: {
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date()
            }
          }
        },
        message: 'Demo analysis - database not available'
      });
    }

    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const readings = await SoilReading.find({
      user: req.user.id,
      readingDate: { $gte: startDate }
    }).sort({ readingDate: -1 });

    if (readings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No soil readings found for analysis'
      });
    }

    const latestReading = readings[0];
    const trends = readings.map(reading => ({
      date: reading.readingDate,
      pH: reading.pH,
      nitrogen: reading.nitrogen,
      phosphorus: reading.phosphorus,
      potassium: reading.potassium,
      healthScore: reading.analysis.healthScore
    }));

    const stats = {
      averageHealthScore: readings.reduce((acc, curr) => acc + curr.analysis.healthScore, 0) / readings.length,
      totalReadings: readings.length,
      dateRange: {
        start: startDate,
        end: new Date()
      }
    };

    res.status(200).json({
      success: true,
      data: {
        latestAnalysis: latestReading.analysis,
        trends,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getSoilStats = async (req, res) => {
  try {
    if (!SoilReading) {
      return res.status(200).json({
        success: true,
        data: {
          overview: {
            totalReadings: 1,
            avgHealthScore: 75,
            avgPH: 6.8,
            avgNitrogen: 45,
            avgPhosphorus: 20,
            avgPotassium: 120,
            latestReading: new Date()
          },
          urgencyBreakdown: [
            { _id: 'low', count: 1 }
          ]
        },
        message: 'Demo stats - database not available'
      });
    }

    const stats = await SoilReading.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: null,
          totalReadings: { $sum: 1 },
          avgHealthScore: { $avg: '$analysis.healthScore' },
          avgPH: { $avg: '$pH' },
          avgNitrogen: { $avg: '$nitrogen' },
          avgPhosphorus: { $avg: '$phosphorus' },
          avgPotassium: { $avg: '$potassium' },
          latestReading: { $max: '$readingDate' }
        }
      }
    ]);

    const urgencyStats = await SoilReading.aggregate([
      {
        $match: { user: req.user._id }
      },
      {
        $group: {
          _id: '$analysis.urgency',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: stats[0] || {},
        urgencyBreakdown: urgencyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper functions for fallback analysis
function calculateHealthScore(pH, nitrogen, phosphorus, potassium, moisture) {
  let score = 100;
  
  // pH scoring (optimal: 6.0-7.5)
  if (pH < 5.5 || pH > 8.0) score -= 30;
  else if (pH < 6.0 || pH > 7.5) score -= 15;

  // Nutrient scoring
  if (nitrogen < 30) score -= 20;
  else if (nitrogen < 50) score -= 10;
  
  if (phosphorus < 15) score -= 20;
  else if (phosphorus < 25) score -= 10;
  
  if (potassium < 100) score -= 20;
  else if (potassium < 150) score -= 10;

  // Moisture scoring
  if (moisture && (moisture < 20 || moisture > 80)) score -= 25;
  else if (moisture && (moisture < 30 || moisture > 70)) score -= 10;

  return Math.max(0, Math.round(score));
}

function generateRecommendations(pH, nitrogen, phosphorus, potassium, moisture) {
  const recommendations = [];
  
  if (pH < 6.0) recommendations.push('Apply lime to increase pH level to optimal range (6.0-7.0)');
  if (pH > 7.5) recommendations.push('Add sulfur to decrease pH level to optimal range (6.0-7.0)');
  
  if (nitrogen < 50) recommendations.push('Apply nitrogen-rich fertilizer (urea or ammonium nitrate)');
  if (phosphorus < 25) recommendations.push('Add phosphorus fertilizer (superphosphate)');
  if (potassium < 150) recommendations.push('Apply potassium fertilizer (potassium chloride)');
  
  if (moisture && moisture < 30) recommendations.push('Increase irrigation frequency - soil moisture is low');
  if (moisture && moisture > 70) recommendations.push('Reduce irrigation to prevent waterlogging');

  return recommendations.length > 0 ? recommendations : ['Soil conditions are optimal. Maintain current practices.'];
}

function getStatus(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Poor';
}

function getUrgency(score) {
  if (score < 40) return 'high';
  if (score < 60) return 'medium';
  return 'low';
}

function analyzeNutrients(nitrogen, phosphorus, potassium) {
  return {
    nitrogen: nitrogen >= 50 ? 'Sufficient' : 'Deficient',
    phosphorus: phosphorus >= 25 ? 'Sufficient' : 'Deficient',
    potassium: potassium >= 150 ? 'Sufficient' : 'Deficient'
  };
}