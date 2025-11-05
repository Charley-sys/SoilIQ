const generateAIInsights = (soilData, cropType = 'general') => {
  const insights = [];
  const recommendations = [];
  const warnings = [];
  let overallScore = 100; // Start with perfect score

  // Crop-specific optimal ranges
  const cropRanges = {
    wheat: {
      pH: { optimal: [6.0, 7.0], weight: 20 },
      nitrogen: { optimal: [50, 80], weight: 25 },
      phosphorus: { optimal: [30, 50], weight: 20 },
      potassium: { optimal: [40, 80], weight: 15 },
      moisture: { optimal: [35, 55], weight: 20 }
    },
    corn: {
      pH: { optimal: [5.8, 7.0], weight: 15 },
      nitrogen: { optimal: [60, 100], weight: 30 },
      phosphorus: { optimal: [25, 50], weight: 20 },
      potassium: { optimal: [50, 90], weight: 20 },
      moisture: { optimal: [40, 60], weight: 15 }
    },
    rice: {
      pH: { optimal: [5.5, 6.5], weight: 15 },
      nitrogen: { optimal: [40, 70], weight: 25 },
      phosphorus: { optimal: [20, 40], weight: 20 },
      potassium: { optimal: [30, 60], weight: 20 },
      moisture: { optimal: [60, 80], weight: 20 }
    },
    vegetables: {
      pH: { optimal: [6.0, 7.0], weight: 20 },
      nitrogen: { optimal: [40, 80], weight: 20 },
      phosphorus: { optimal: [30, 60], weight: 20 },
      potassium: { optimal: [40, 80], weight: 20 },
      moisture: { optimal: [45, 65], weight: 20 }
    },
    general: {
      pH: { optimal: [6.0, 7.0], weight: 20 },
      nitrogen: { optimal: [40, 80], weight: 20 },
      phosphorus: { optimal: [30, 50], weight: 20 },
      potassium: { optimal: [40, 80], weight: 20 },
      moisture: { optimal: [40, 60], weight: 20 }
    }
  };

  const ranges = cropRanges[cropType] || cropRanges.general;

  // pH Analysis
  if (soilData.pH < ranges.pH.optimal[0]) {
    const severity = soilData.pH < 5.0 ? 'high' : 'medium';
    insights.push(`Soil is acidic (pH ${soilData.pH})`);
    recommendations.push(`Apply agricultural lime: ${soilData.pH < 5.0 ? '2-4' : '1-2'} tons per acre`);
    overallScore -= severity === 'high' ? 25 : 15;
  } else if (soilData.pH > ranges.pH.optimal[1]) {
    const severity = soilData.pH > 8.0 ? 'high' : 'medium';
    insights.push(`Soil is alkaline (pH ${soilData.pH})`);
    recommendations.push(`Apply sulfur: ${soilData.pH > 8.0 ? '500-1000' : '200-500'} lbs per acre`);
    overallScore -= severity === 'high' ? 25 : 15;
  } else {
    insights.push(`pH level is optimal for ${cropType}`);
  }

  // Nitrogen Analysis
  if (soilData.nitrogen < ranges.nitrogen.optimal[0]) {
    const deficit = ranges.nitrogen.optimal[0] - soilData.nitrogen;
    insights.push(`Low nitrogen level (${soilData.nitrogen} ppm)`);
    recommendations.push(`Apply nitrogen fertilizer: ${deficit * 2} lbs urea per acre`);
    overallScore -= 20;
  } else if (soilData.nitrogen > ranges.nitrogen.optimal[1]) {
    insights.push(`High nitrogen level (${soilData.nitrogen} ppm)`);
    warnings.push("Reduce nitrogen application to prevent leaching");
    overallScore -= 10;
  }

  // Phosphorus Analysis
  if (soilData.phosphorus < ranges.phosphorus.optimal[0]) {
    insights.push(`Low phosphorus level (${soilData.phosphorus} ppm)`);
    recommendations.push(`Apply phosphorus fertilizer: 50-100 lbs DAP per acre`);
    overallScore -= 15;
  }

  // Potassium Analysis
  if (soilData.potassium < ranges.potassium.optimal[0]) {
    insights.push(`Low potassium level (${soilData.potassium} ppm)`);
    recommendations.push(`Apply potassium fertilizer: 50-100 lbs MOP per acre`);
    overallScore -= 15;
  }

  // Moisture Analysis
  if (soilData.moisture < ranges.moisture.optimal[0]) {
    insights.push(`Low soil moisture (${soilData.moisture}%)`);
    recommendations.push(`Irrigate immediately: Apply 1-2 inches of water`);
    overallScore -= 15;
  } else if (soilData.moisture > ranges.moisture.optimal[1]) {
    insights.push(`High soil moisture (${soilData.moisture}%)`);
    warnings.push("Ensure proper drainage to prevent waterlogging");
    overallScore -= 10;
  }

  // Organic Matter Analysis
  if (soilData.organicMatter < 2.0) {
    insights.push(`Very low organic matter (${soilData.organicMatter}%)`);
    recommendations.push("Add compost: 5-10 tons per acre");
    overallScore -= 10;
  } else if (soilData.organicMatter < 3.0) {
    insights.push(`Low organic matter (${soilData.organicMatter}%)`);
    recommendations.push("Add compost: 2-5 tons per acre");
    overallScore -= 5;
  }

  // Determine overall health status
  let healthStatus = 'Excellent';
  if (overallScore < 70) healthStatus = 'Needs Improvement';
  else if (overallScore < 85) healthStatus = 'Good';
  else if (overallScore < 95) healthStatus = 'Very Good';

  return {
    insights,
    recommendations,
    warnings,
    overallScore: Math.max(0, overallScore),
    healthStatus,
    generatedAt: new Date(),
    cropType
  };
};

module.exports = { generateAIInsights };