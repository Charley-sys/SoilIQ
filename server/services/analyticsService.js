const SoilReading = require('../models/soilReading');
const mongoose = require('mongoose');

class AnalyticsService {
  
  // Comprehensive soil health analysis
  async getComprehensiveAnalysis(userId, farmId, period = '30d') {
    try {
      const dateRange = this.getDateRange(period);
      const readings = await this.getReadingsInRange(userId, farmId, dateRange);
      
      if (readings.length === 0) {
        return { error: 'No data available for analysis' };
      }

      const analysis = {
        summary: await this.generateSummary(readings),
        trends: await this.analyzeTrends(readings),
        correlations: await this.findCorrelations(readings),
        seasonalPatterns: await this.detectSeasonalPatterns(readings),
        predictions: await this.generatePredictions(readings),
        recommendations: await this.generateAdvancedRecommendations(readings),
        riskAssessment: await this.assessRisks(readings)
      };

      return analysis;
    } catch (error) {
      console.error('Comprehensive analysis error:', error);
      throw new Error('Failed to generate analysis');
    }
  }

  // Generate detailed summary
  async generateSummary(readings) {
    const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];
    const summary = {};

    for (const param of parameters) {
      const values = readings.map(r => r[param]).filter(v => v != null);
      if (values.length > 0) {
        summary[param] = {
          average: this.calculateAverage(values),
          median: this.calculateMedian(values),
          min: Math.min(...values),
          max: Math.max(...values),
          standardDeviation: this.calculateStandardDeviation(values),
          trend: this.calculateTrend(values),
          stability: this.calculateStability(values)
        };
      }
    }

    // Overall health score
    summary.healthScore = this.calculateComprehensiveHealthScore(summary);
    
    return summary;
  }

  // Analyze trends over time
  async analyzeTrends(readings) {
    const sortedReadings = [...readings].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    const trends = {};
    const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];

    parameters.forEach(param => {
      const values = sortedReadings.map(r => r[param]).filter(v => v != null);
      if (values.length > 1) {
        trends[param] = {
          slope: this.calculateLinearRegression(values),
          direction: this.getTrendDirection(values),
          confidence: this.calculateTrendConfidence(values),
          rateOfChange: this.calculateRateOfChange(values)
        };
      }
    });

    return trends;
  }

  // Find correlations between parameters
  async findCorrelations(readings) {
    const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];
    const correlations = {};

    for (let i = 0; i < parameters.length; i++) {
      for (let j = i + 1; j < parameters.length; j++) {
        const param1 = parameters[i];
        const param2 = parameters[j];
        
        const values1 = readings.map(r => r[param1]).filter(v => v != null);
        const values2 = readings.map(r => r[param2]).filter(v => v != null);
        
        if (values1.length > 5 && values2.length > 5) {
          const correlation = this.calculateCorrelation(values1, values2);
          if (Math.abs(correlation) > 0.3) { // Only report meaningful correlations
            correlations[`${param1}_${param2}`] = {
              correlation: correlation,
              strength: this.getCorrelationStrength(correlation),
              interpretation: this.interpretCorrelation(param1, param2, correlation)
            };
          }
        }
      }
    }

    return correlations;
  }

  // Detect seasonal patterns
  async detectSeasonalPatterns(readings) {
    const monthlyData = {};
    
    readings.forEach(reading => {
      const month = new Date(reading.createdAt).getMonth();
      if (!monthlyData[month]) {
        monthlyData[month] = [];
      }
      monthlyData[month].push(reading);
    });

    const patterns = {};
    const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];

    parameters.forEach(param => {
      const monthlyAverages = [];
      for (let month = 0; month < 12; month++) {
        if (monthlyData[month]) {
          const values = monthlyData[month].map(r => r[param]).filter(v => v != null);
          if (values.length > 0) {
            monthlyAverages.push({
              month: month,
              average: this.calculateAverage(values),
              count: values.length
            });
          }
        }
      }
      
      if (monthlyAverages.length > 0) {
        patterns[param] = {
          hasSeasonality: this.detectSeasonality(monthlyAverages.map(m => m.average)),
          monthlyAverages: monthlyAverages,
          peakMonth: this.findPeakMonth(monthlyAverages),
          lowMonth: this.findLowMonth(monthlyAverages)
        };
      }
    });

    return patterns;
  }

  // Generate predictions
  async generatePredictions(readings) {
    const sortedReadings = [...readings].sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    const predictions = {};
    const parameters = ['pH', 'nitrogen', 'phosphorus', 'potassium', 'moisture', 'organicMatter'];

    parameters.forEach(param => {
      const values = sortedReadings.map(r => r[param]).filter(v => v != null);
      if (values.length > 5) {
        const futureValues = this.predictFutureValues(values, 3); // Predict next 3 periods
        predictions[param] = {
          nextValue: futureValues[0],
          trend: futureValues[0] > values[values.length - 1] ? 'increasing' : 'decreasing',
          confidence: this.calculatePredictionConfidence(values),
          forecast: futureValues.map((value, index) => ({
            period: index + 1,
            predictedValue: value
          }))
        };
      }
    });

    return predictions;
  }

  // Generate advanced AI recommendations
  async generateAdvancedRecommendations(readings) {
    const summary = await this.generateSummary(readings);
    const trends = await this.analyzeTrends(readings);
    const correlations = await this.findCorrelations(readings);

    const recommendations = [];
    const alerts = [];

    // Nutrient balance analysis
    const npkRatio = this.calculateNPKRatio(summary);
    if (npkRatio.imbalance > 0.3) {
      recommendations.push({
        type: 'nutrient_balance',
        priority: 'high',
        title: 'Nutrient Imbalance Detected',
        message: `NPK ratio is unbalanced: ${npkRatio.ratio}. Optimal ratio depends on crop type.`,
        action: 'Adjust fertilizer application to achieve balanced nutrition',
        impact: 'high',
        expectedImprovement: '15-25% yield improvement'
      });
    }

    // Soil health improvement opportunities
    if (summary.organicMatter && summary.organicMatter.average < 3) {
      recommendations.push({
        type: 'soil_health',
        priority: 'medium',
        title: 'Improve Soil Organic Matter',
        message: `Current organic matter (${summary.organicMatter.average.toFixed(1)}%) is below optimal levels.`,
        action: 'Add compost, cover crops, or organic amendments',
        timing: 'Next 3-6 months',
        impact: 'long-term',
        expectedImprovement: 'Improved water retention and nutrient availability'
      });
    }

    // Irrigation optimization
    if (summary.moisture && summary.moisture.stability < 0.7) {
      recommendations.push({
        type: 'irrigation',
        priority: 'medium',
        title: 'Irrigation Schedule Optimization',
        message: 'Soil moisture levels show high variability, indicating suboptimal irrigation.',
        action: 'Implement scheduled irrigation based on soil moisture monitoring',
        impact: 'medium',
        expectedImprovement: '20-30% water savings'
      });
    }

    // pH management
    if (summary.pH && (summary.pH.average < 5.5 || summary.pH.average > 7.5)) {
      recommendations.push({
        type: 'ph_management',
        priority: 'high',
        title: 'pH Correction Needed',
        message: `Soil pH (${summary.pH.average.toFixed(1)}) is outside optimal range for most crops.`,
        action: summary.pH.average < 5.5 ? 'Apply lime' : 'Apply sulfur or acidifying amendments',
        timing: 'Before next planting',
        impact: 'high',
        expectedImprovement: '30-50% better nutrient availability'
      });
    }

    return {
      recommendations,
      alerts,
      summary: {
        totalRecommendations: recommendations.length,
        priorityBreakdown: this.calculatePriorityBreakdown(recommendations),
        estimatedImpact: this.calculateTotalImpact(recommendations)
      }
    };
  }

  // Risk assessment
  async assessRisks(readings) {
    const risks = [];
    const summary = await this.generateSummary(readings);

    // Nutrient deficiency risks
    if (summary.nitrogen && summary.nitrogen.average < 25) {
      risks.push({
        type: 'nutrient_deficiency',
        parameter: 'nitrogen',
        level: 'high',
        probability: 0.8,
        impact: 'Yield reduction up to 40%',
        mitigation: 'Apply nitrogen fertilizer immediately'
      });
    }

    if (summary.phosphorus && summary.phosphorus.average < 15) {
      risks.push({
        type: 'nutrient_deficiency',
        parameter: 'phosphorus',
        level: 'medium',
        probability: 0.6,
        impact: 'Poor root development and flowering',
        mitigation: 'Apply phosphorus fertilizer at planting'
      });
    }

    // Environmental risks
    if (summary.moisture && summary.moisture.average < 20) {
      risks.push({
        type: 'drought_risk',
        parameter: 'moisture',
        level: 'high',
        probability: 0.7,
        impact: 'Crop stress and potential failure',
        mitigation: 'Increase irrigation frequency'
      });
    }

    // Soil health risks
    if (summary.organicMatter && summary.organicMatter.average < 2) {
      risks.push({
        type: 'soil_degradation',
        parameter: 'organic_matter',
        level: 'medium',
        probability: 0.5,
        impact: 'Long-term soil fertility decline',
        mitigation: 'Implement soil building practices'
      });
    }

    return {
      risks,
      overallRiskLevel: this.calculateOverallRiskLevel(risks),
      riskByCategory: this.categorizeRisks(risks)
    };
  }

  // Utility methods
  getDateRange(period) {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 30);
    }

    return { startDate, endDate: now };
  }

  async getReadingsInRange(userId, farmId, dateRange) {
    return await SoilReading.find({
      user: userId,
      farm: farmId,
      createdAt: {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      }
    }).sort({ createdAt: 1 });
  }

  calculateAverage(values) {
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  calculateMedian(values) {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  calculateStandardDeviation(values) {
    const avg = this.calculateAverage(values);
    const squareDiffs = values.map(value => Math.pow(value - avg, 2));
    const avgSquareDiff = this.calculateAverage(squareDiffs);
    return Math.sqrt(avgSquareDiff);
  }

  calculateTrend(values) {
    if (values.length < 2) return 'stable';
    const first = values[0];
    const last = values[values.length - 1];
    const change = ((last - first) / first) * 100;
    return Math.abs(change) < 5 ? 'stable' : change > 0 ? 'increasing' : 'decreasing';
  }

  calculateStability(values) {
    const stdDev = this.calculateStandardDeviation(values);
    const avg = this.calculateAverage(values);
    return 1 - (stdDev / avg); // Higher value = more stable
  }

  calculateComprehensiveHealthScore(summary) {
    let score = 0;
    let factors = 0;

    // pH score
    if (summary.pH) {
      const pH = summary.pH.average;
      if (pH >= 6.0 && pH <= 7.0) score += 25;
      else if (pH >= 5.5 && pH <= 7.5) score += 15;
      else score += 5;
      factors++;
    }

    // Nutrient score
    if (summary.nitrogen && summary.phosphorus && summary.potassium) {
      const nutrientAvg = (summary.nitrogen.average + summary.phosphorus.average + summary.potassium.average) / 3;
      if (nutrientAvg >= 40 && nutrientAvg <= 80) score += 25;
      else if (nutrientAvg >= 20 && nutrientAvg <= 100) score += 15;
      else score += 5;
      factors++;
    }

    // Moisture score
    if (summary.moisture) {
      const moisture = summary.moisture.average;
      if (moisture >= 40 && moisture <= 60) score += 25;
      else if (moisture >= 25 && moisture <= 75) score += 15;
      else score += 5;
      factors++;
    }

    // Organic matter score
    if (summary.organicMatter) {
      const organicMatter = summary.organicMatter.average;
      if (organicMatter >= 3 && organicMatter <= 5) score += 25;
      else if (organicMatter >= 2 && organicMatter <= 6) score += 15;
      else score += 5;
      factors++;
    }

    return factors > 0 ? Math.round(score / factors) : 0;
  }

  // ... Additional mathematical and statistical methods
  calculateLinearRegression(values) {
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, _, i) => sum + (i * values[i]), 0);
    const sumXX = x.reduce((sum, _, i) => sum + (i * i), 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }

  calculateCorrelation(x, y) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, _, i) => sum + (x[i] * y[i]), 0);
    const sumXX = x.reduce((sum, val) => sum + (val * val), 0);
    const sumYY = y.reduce((sum, val) => sum + (val * val), 0);
    
    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return denominator === 0 ? 0 : numerator / denominator;
  }

  calculateNPKRatio(summary) {
    if (!summary.nitrogen || !summary.phosphorus || !summary.potassium) {
      return { ratio: 'N/A', imbalance: 0 };
    }

    const n = summary.nitrogen.average;
    const p = summary.phosphorus.average;
    const k = summary.potassium.average;
    
    const total = n + p + k;
    const ratio = `${(n/total*100).toFixed(0)}:${(p/total*100).toFixed(0)}:${(k/total*100).toFixed(0)}`;
    
    // Calculate imbalance (deviation from ideal 4:2:1 ratio)
    const idealN = 4/7, idealP = 2/7, idealK = 1/7;
    const actualN = n/total, actualP = p/total, actualK = k/total;
    
    const imbalance = Math.abs(actualN - idealN) + Math.abs(actualP - idealP) + Math.abs(actualK - idealK);
    
    return { ratio, imbalance };
  }

  getTrendDirection(values) {
    const slope = this.calculateLinearRegression(values);
    return slope > 0.1 ? 'up' : slope < -0.1 ? 'down' : 'stable';
  }

  calculateTrendConfidence(values) {
    if (values.length < 3) return 0;
    const slope = this.calculateLinearRegression(values);
    return Math.min(Math.abs(slope) * 10, 1); // Simple confidence measure
  }

  calculateRateOfChange(values) {
    if (values.length < 2) return 0;
    const first = values[0];
    const last = values[values.length - 1];
    return ((last - first) / first) * 100;
  }

  getCorrelationStrength(correlation) {
    const absCorr = Math.abs(correlation);
    if (absCorr >= 0.8) return 'very strong';
    if (absCorr >= 0.6) return 'strong';
    if (absCorr >= 0.4) return 'moderate';
    if (absCorr >= 0.2) return 'weak';
    return 'very weak';
  }

  interpretCorrelation(param1, param2, correlation) {
    const interpretations = {
      'pH_nitrogen': 'pH affects nitrogen availability',
      'pH_phosphorus': 'pH affects phosphorus availability', 
      'moisture_nitrogen': 'Moisture affects nitrogen mobility',
      'moisture_organicMatter': 'Organic matter improves moisture retention'
    };
    
    const key = `${param1}_${param2}`;
    const reverseKey = `${param2}_${param1}`;
    
    return interpretations[key] || interpretations[reverseKey] || 'Parameter relationship';
  }

  detectSeasonality(monthlyAverages) {
    if (monthlyAverages.length < 6) return false;
    
    const range = Math.max(...monthlyAverages) - Math.min(...monthlyAverages);
    const avg = this.calculateAverage(monthlyAverages);
    
    return (range / avg) > 0.2; // More than 20% variation indicates seasonality
  }

  findPeakMonth(monthlyAverages) {
    return monthlyAverages.reduce((max, current) => 
      current.average > max.average ? current : max
    ).month;
  }

  findLowMonth(monthlyAverages) {
    return monthlyAverages.reduce((min, current) => 
      current.average < min.average ? current : min
    ).month;
  }

  predictFutureValues(values, periods = 3) {
    const slope = this.calculateLinearRegression(values);
    const lastValue = values[values.length - 1];
    
    return Array.from({ length: periods }, (_, i) => 
      lastValue + (slope * (i + 1))
    );
  }

  calculatePredictionConfidence(values) {
    const stability = this.calculateStability(values);
    return Math.min(stability * 1.5, 0.95); // Cap at 95% confidence
  }

  calculatePriorityBreakdown(recommendations) {
    const priorities = { high: 0, medium: 0, low: 0 };
    recommendations.forEach(rec => {
      priorities[rec.priority] = (priorities[rec.priority] || 0) + 1;
    });
    return priorities;
  }

  calculateTotalImpact(recommendations) {
    const impactScores = { high: 3, medium: 2, low: 1 };
    return recommendations.reduce((total, rec) => 
      total + (impactScores[rec.priority] || 1), 0
    );
  }

  calculateOverallRiskLevel(risks) {
    if (risks.length === 0) return 'low';
    
    const riskScores = { high: 3, medium: 2, low: 1 };
    const totalScore = risks.reduce((sum, risk) => 
      sum + (riskScores[risk.level] || 1) * risk.probability, 0
    );
    
    const averageScore = totalScore / risks.length;
    return averageScore >= 2 ? 'high' : averageScore >= 1 ? 'medium' : 'low';
  }

  categorizeRisks(risks) {
    const categories = {};
    risks.forEach(risk => {
      if (!categories[risk.type]) {
        categories[risk.type] = [];
      }
      categories[risk.type].push(risk);
    });
    return categories;
  }
}

module.exports = new AnalyticsService();