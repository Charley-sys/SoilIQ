const AnalyticsService = require('../services/analyticsService');
const SoilReading = require('../models/soilReading');
const SoilAI = require('../utils/aiEngine'); // Import your AI engine

// Helper function to get demo user ID
const getDemoUserId = () => 'demo-user-' + Date.now();

// Helper function to generate demo soil readings
const generateDemoReadings = (period = '30d') => {
  const readings = [];
  const now = new Date();
  let daysBack;
  
  switch (period) {
    case '7d': daysBack = 7; break;
    case '30d': daysBack = 30; break;
    case '90d': daysBack = 90; break;
    case '1y': daysBack = 365; break;
    default: daysBack = 30;
  }

  for (let i = 0; i < daysBack; i += Math.max(1, Math.floor(daysBack / 10))) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    readings.push({
      pH: 5.8 + Math.random() * 1.4, // 5.8-7.2
      nitrogen: 30 + Math.random() * 50, // 30-80
      phosphorus: 15 + Math.random() * 40, // 15-55
      potassium: 20 + Math.random() * 40, // 20-60
      moisture: 40 + Math.random() * 40, // 40-80
      temperature: 18 + Math.random() * 15, // 18-33
      organicMatter: 2 + Math.random() * 3, // 2-5
      timestamp: date.toISOString()
    });
  }
  
  return readings;
};

exports.getComprehensiveAnalysis = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { period = '30d' } = req.query;

    // For demo mode, generate analysis without user authentication
    let analysis;
    if (farmId === 'demo' || !farmId) {
      // Generate demo analysis using your AI engine
      const demoReadings = generateDemoReadings(period);
      const latestReading = demoReadings[0];
      
      analysis = {
        healthScore: SoilAI.calculateHealthScore(
          latestReading.pH,
          latestReading.nitrogen,
          latestReading.phosphorus,
          latestReading.potassium,
          latestReading.moisture,
          latestReading.organicMatter
        ),
        parameters: latestReading,
        trends: demoReadings.map(reading => ({
          timestamp: reading.timestamp,
          healthScore: SoilAI.calculateHealthScore(
            reading.pH,
            reading.nitrogen,
            reading.phosphorus,
            reading.potassium,
            reading.moisture,
            reading.organicMatter
          ),
          pH: reading.pH,
          nitrogen: reading.nitrogen,
          phosphorus: reading.phosphorus,
          potassium: reading.potassium
        })),
        aiInsights: SoilAI.analyzeSoil(latestReading),
        period: period,
        farmId: farmId || 'demo-farm',
        isDemo: true
      };
    } else {
      // For real farm analysis, use the existing service
      // Note: You might need to modify AnalyticsService to work without user ID
      analysis = await AnalyticsService.getComprehensiveAnalysis(
        req.user?.id || getDemoUserId(),
        farmId,
        period
      );

      if (analysis.error) {
        return res.status(404).json({
          status: 'error',
          message: analysis.error
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: analysis
    });
  } catch (error) {
    console.error('Comprehensive analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating comprehensive analysis'
    });
  }
};

exports.getComparativeAnalysis = async (req, res) => {
  try {
    const { farmIds, period = '30d' } = req.query;
    
    // For demo mode, generate comparative analysis without specific farm IDs
    if (!farmIds || farmIds === 'demo') {
      const demoFarms = [
        { id: 'demo-farm-1', name: 'North Field' },
        { id: 'demo-farm-2', name: 'South Field' },
        { id: 'demo-farm-3', name: 'East Field' }
      ];

      const comparisons = [];

      for (const farm of demoFarms) {
        const demoReadings = generateDemoReadings(period);
        const latestReading = demoReadings[0];
        
        const analysis = {
          healthScore: SoilAI.calculateHealthScore(
            latestReading.pH,
            latestReading.nitrogen,
            latestReading.phosphorus,
            latestReading.potassium,
            latestReading.moisture,
            latestReading.organicMatter
          ),
          parameters: latestReading,
          aiInsights: SoilAI.analyzeSoil(latestReading)
        };

        comparisons.push({
          farmId: farm.id,
          farmName: farm.name,
          analysis
        });
      }

      return res.status(200).json({
        status: 'success',
        data: {
          comparisons,
          period,
          totalFarms: comparisons.length,
          isDemo: true
        }
      });
    }

    // For real farm comparisons
    const farmIdArray = Array.isArray(farmIds) ? farmIds : farmIds.split(',');
    const comparisons = [];

    for (const farmId of farmIdArray) {
      const analysis = await AnalyticsService.getComprehensiveAnalysis(
        req.user?.id || getDemoUserId(),
        farmId,
        period
      );
      
      if (!analysis.error) {
        comparisons.push({
          farmId,
          analysis
        });
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        comparisons,
        period,
        totalFarms: comparisons.length
      }
    });
  } catch (error) {
    console.error('Comparative analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating comparative analysis'
    });
  }
};

exports.getHistoricalTrends = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { parameter = 'healthScore', period = '1y' } = req.query;

    // For demo mode, generate historical trends
    if (farmId === 'demo' || !farmId) {
      const demoReadings = generateDemoReadings(period);
      
      const trends = demoReadings.map(reading => ({
        timestamp: reading.timestamp,
        value: reading[parameter] || SoilAI.calculateHealthScore(
          reading.pH,
          reading.nitrogen,
          reading.phosphorus,
          reading.potassium,
          reading.moisture,
          reading.organicMatter
        )
      }));

      // Calculate trend direction
      const firstValue = trends[0]?.value;
      const lastValue = trends[trends.length - 1]?.value;
      const trendDirection = lastValue > firstValue ? 'improving' : lastValue < firstValue ? 'declining' : 'stable';

      return res.status(200).json({
        status: 'success',
        data: {
          parameter,
          period,
          trends: {
            direction: trendDirection,
            change: lastValue - firstValue,
            percentageChange: ((lastValue - firstValue) / firstValue * 100).toFixed(1)
          },
          dataPoints: trends,
          isDemo: true
        }
      });
    }

    // For real farm historical trends
    const dateRange = AnalyticsService.getDateRange(period);
    const readings = await AnalyticsService.getReadingsInRange(
      req.user?.id || getDemoUserId(),
      farmId,
      dateRange
    );

    if (readings.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No data available for the specified period'
      });
    }

    // Group by time intervals (weekly, monthly, etc.)
    const groupedData = AnalyticsService.groupByTimeInterval(readings, period);
    const trends = AnalyticsService.analyzeParameterTrends(groupedData, parameter);

    res.status(200).json({
      status: 'success',
      data: {
        parameter,
        period,
        trends,
        dataPoints: groupedData
      }
    });
  } catch (error) {
    console.error('Historical trends error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating historical trends'
    });
  }
};

exports.exportAnalyticsData = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { format = 'json', period = '30d' } = req.query;

    let analysis;
    
    // For demo mode, generate export data
    if (farmId === 'demo' || !farmId) {
      const demoReadings = generateDemoReadings(period);
      const latestReading = demoReadings[0];
      
      analysis = {
        healthScore: SoilAI.calculateHealthScore(
          latestReading.pH,
          latestReading.nitrogen,
          latestReading.phosphorus,
          latestReading.potassium,
          latestReading.moisture,
          latestReading.organicMatter
        ),
        parameters: latestReading,
        aiInsights: SoilAI.analyzeSoil(latestReading),
        historicalData: demoReadings,
        exportDate: new Date().toISOString(),
        isDemo: true
      };
    } else {
      // For real farm export
      analysis = await AnalyticsService.getComprehensiveAnalysis(
        req.user?.id || getDemoUserId(),
        farmId,
        period
      );

      if (analysis.error) {
        return res.status(404).json({
          status: 'error',
          message: analysis.error
        });
      }
    }

    // Set headers for download
    const filename = `soil-analytics-${farmId || 'demo'}-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);
      
      // Convert analysis to CSV format
      const csvData = AnalyticsService.convertToCSV(analysis);
      return res.send(csvData);
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.json"`);
      return res.send(JSON.stringify(analysis, null, 2));
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error exporting analytics data'
    });
  }
};

// New demo analysis endpoint
exports.getDemoAnalysis = async (req, res) => {
  try {
    const demoReadings = generateDemoReadings('30d');
    const latestReading = demoReadings[0];
    
    const analysis = SoilAI.analyzeSoil(latestReading);
    
    res.status(200).json({
      status: 'success',
      data: {
        analysis: {
          ...analysis,
          parameters: latestReading,
          historicalTrends: demoReadings.slice(0, 5).map(reading => ({
            timestamp: reading.timestamp,
            healthScore: SoilAI.calculateHealthScore(
              reading.pH,
              reading.nitrogen,
              reading.phosphorus,
              reading.potassium,
              reading.moisture,
              reading.organicMatter
            )
          }))
        },
        message: 'Demo analysis - add your soil data for personalized insights',
        isDemo: true
      }
    });
  } catch (error) {
    console.error('Demo analysis error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error generating demo analysis'
    });
  }
};