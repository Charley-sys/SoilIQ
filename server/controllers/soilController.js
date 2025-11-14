// server/controllers/soilController.js
const SoilReading = require('../models/SoilReading');
const Farm = require('../models/Farm');
const SoilAI = require('../utils/aiEngine');

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

    // Generate AI analysis
    console.log('🤖 Generating AI analysis...');
    const analysis = SoilAI.analyzeSoil({
      pH,
      nitrogen,
      phosphorus,
      potassium,
      temperature,
      moisture
    });

    console.log('✅ AI analysis generated:', analysis);

    // Create soil reading
    const soilReading = await SoilReading.create({
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
      analysis
    });

    console.log('✅ Soil reading saved to database');

    // Populate user data
    await soilReading.populate('user', 'name email');

    res.status(201).json({
      success: true,
      data: {
        soilReading
      }
    });
  } catch (error) {
    console.error('❌ Error creating soil reading:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create soil reading: ' + error.message
    });
  }
};

exports.getSoilReadings = async (req, res) => {
  try {
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