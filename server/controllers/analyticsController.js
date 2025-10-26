const AnalyticsService = require('../services/analyticsService');
const SoilReading = require('../models/soilReading');

exports.getComprehensiveAnalysis = async (req, res) => {
  try {
    const { farmId } = req.params;
    const { period = '30d' } = req.query;

    const analysis = await AnalyticsService.getComprehensiveAnalysis(
      req.user.id,
      farmId,
      period
    );

    if (analysis.error) {
      return res.status(404).json({
        status: 'error',
        message: analysis.error
      });
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
    
    if (!farmIds) {
      return res.status(400).json({
        status: 'error',
        message: 'Farm IDs are required'
      });
    }

    const farmIdArray = Array.isArray(farmIds) ? farmIds : farmIds.split(',');
    const comparisons = [];

    for (const farmId of farmIdArray) {
      const analysis = await AnalyticsService.getComprehensiveAnalysis(
        req.user.id,
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
    const { parameter, period = '1y' } = req.query;

    const dateRange = AnalyticsService.getDateRange(period);
    const readings = await AnalyticsService.getReadingsInRange(
      req.user.id,
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

    const analysis = await AnalyticsService.getComprehensiveAnalysis(
      req.user.id,
      farmId,
      period
    );

    if (analysis.error) {
      return res.status(404).json({
        status: 'error',
        message: analysis.error
      });
    }

    // Set headers for download
    const filename = `soil-analytics-${farmId}-${new Date().toISOString().split('T')[0]}`;

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