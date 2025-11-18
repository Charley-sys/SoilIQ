// server/utils/aiEngine.js
class SoilAI {
  static analyzeSoil(readings) {
    const { pH, nitrogen, phosphorus, potassium, temperature, moisture, organicMatter, salinity } = readings;
    
    const insights = [];
    const recommendations = [];
    const risks = [];
    const fertilizerRecommendations = [];
    const immediateActions = [];

    // pH Analysis
    if (pH < 5.5) {
      insights.push("Soil is highly acidic - nutrient availability reduced");
      recommendations.push("Apply agricultural lime at 2-4 tons per hectare");
      fertilizerRecommendations.push({
        type: "Agricultural Lime",
        amount: "2-4 tons/hectare",
        timing: "Before planting season",
        purpose: "Raise pH and improve nutrient availability"
      });
      risks.push("Aluminum and manganese toxicity risk");
      immediateActions.push("Test soil pH in different areas of the field");
    } else if (pH < 6.0) {
      insights.push("Soil is moderately acidic - some nutrients may be limited");
      recommendations.push("Consider adding dolomitic lime if magnesium is also low");
    } else if (pH >= 6.0 && pH <= 7.0) {
      insights.push("Optimal pH range for most crops - excellent nutrient availability");
    } else if (pH > 7.0 && pH <= 7.5) {
      insights.push("Soil is slightly alkaline - monitor micronutrient levels");
      recommendations.push("Use acid-forming fertilizers if micronutrient deficiencies appear");
    } else if (pH > 7.5) {
      insights.push("Soil is alkaline - micronutrient deficiencies likely");
      recommendations.push("Apply sulfur or acidifying fertilizers");
      fertilizerRecommendations.push({
        type: "Elemental Sulfur",
        amount: "500-1000 kg/hectare",
        timing: "3-4 months before planting",
        purpose: "Lower pH and improve micronutrient availability"
      });
      risks.push("Iron, manganese, and zinc deficiencies expected");
    }

    // Nitrogen Analysis
    if (nitrogen < 25) {
      insights.push("Severe nitrogen deficiency detected");
      recommendations.push("Apply nitrogen-rich fertilizer immediately");
      fertilizerRecommendations.push({
        type: "Urea or Ammonium Nitrate",
        amount: "100-150 kg N/hectare",
        timing: "Immediate application",
        purpose: "Correct severe nitrogen deficiency"
      });
      risks.push("Poor plant growth, yellowing leaves, reduced yield");
      immediateActions.push("Apply split applications of nitrogen fertilizer");
    } else if (nitrogen < 40) {
      insights.push("Moderate nitrogen deficiency");
      recommendations.push("Supplement with nitrogen fertilizer");
      fertilizerRecommendations.push({
        type: "Urea",
        amount: "50-100 kg N/hectare",
        timing: "Next application cycle",
        purpose: "Boost nitrogen levels"
      });
    } else if (nitrogen >= 40 && nitrogen <= 60) {
      insights.push("Optimal nitrogen levels for most crops");
    } else if (nitrogen > 60 && nitrogen <= 80) {
      insights.push("Adequate nitrogen levels");
    } else if (nitrogen > 80) {
      insights.push("Excess nitrogen levels detected");
      recommendations.push("Reduce nitrogen application in next cycle");
      risks.push("Environmental pollution, excessive vegetative growth, reduced fruit quality");
      immediateActions.push("Monitor for signs of nitrogen burn on leaves");
    }

    // Phosphorus Analysis
    if (phosphorus < 15) {
      insights.push("Severe phosphorus deficiency");
      recommendations.push("Apply phosphate fertilizers for root development");
      fertilizerRecommendations.push({
        type: "DAP or SSP",
        amount: "60-90 kg P₂O₅/hectare",
        timing: "At planting",
        purpose: "Correct phosphorus deficiency for root growth"
      });
      risks.push("Poor root development, delayed maturity, purple leaves");
    } else if (phosphorus < 25) {
      insights.push("Moderate phosphorus deficiency");
      recommendations.push("Supplement with phosphorus fertilizer");
      fertilizerRecommendations.push({
        type: "DAP",
        amount: "30-45 kg P₂O₅/hectare",
        timing: "At planting",
        purpose: "Improve phosphorus availability"
      });
    } else if (phosphorus >= 25 && phosphorus <= 50) {
      insights.push("Optimal phosphorus levels");
    } else if (phosphorus > 50) {
      insights.push("High phosphorus levels - monitor for zinc and iron deficiencies");
    }

    // Potassium Analysis
    if (potassium < 20) {
      insights.push("Potassium deficiency detected");
      recommendations.push("Apply potash fertilizers for fruit quality and disease resistance");
      fertilizerRecommendations.push({
        type: "MOP (Muriate of Potash)",
        amount: "60-120 kg K₂O/hectare",
        timing: "Before flowering",
        purpose: "Improve fruit quality and stress tolerance"
      });
      risks.push("Reduced fruit quality, increased disease susceptibility, weak stems");
    } else if (potassium < 30) {
      insights.push("Moderate potassium levels");
      recommendations.push("Maintain current potassium application rates");
    } else if (potassium >= 30 && potassium <= 50) {
      insights.push("Optimal potassium levels");
    } else if (potassium > 50) {
      insights.push("High potassium levels - may affect magnesium uptake");
    }

    // Temperature Analysis (if provided)
    if (temperature !== undefined) {
      if (temperature < 10) {
        insights.push("Low soil temperature - microbial activity reduced");
        recommendations.push("Consider using plastic mulch to warm soil");
        risks.push("Slow nutrient mineralization, delayed seed germination");
      } else if (temperature > 35) {
        insights.push("High soil temperature - increased nutrient loss possible");
        recommendations.push("Maintain soil moisture and use organic mulch");
        risks.push("Increased volatilization of nitrogen, root damage");
      }
    }

    // Moisture Analysis (if provided)
    if (moisture !== undefined) {
      if (moisture < 20) {
        insights.push("Low soil moisture - irrigation needed");
        recommendations.push("Implement irrigation schedule");
        immediateActions.push("Water deeply to encourage deep root growth");
        risks.push("Drought stress, nutrient uptake impaired");
      } else if (moisture > 80) {
        insights.push("Excessive soil moisture - drainage issues");
        recommendations.push("Improve soil drainage");
        risks.push("Root rot, nutrient leaching, oxygen deficiency");
      }
    }

    // Organic Matter Analysis (if provided)
    if (organicMatter !== undefined) {
      if (organicMatter < 2) {
        insights.push("Very low organic matter content");
        recommendations.push("Add compost, manure, or cover crops");
        fertilizerRecommendations.push({
          type: "Compost or Well-rotted Manure",
          amount: "10-20 tons/hectare",
          timing: "Before planting season",
          purpose: "Improve soil structure and nutrient holding capacity"
        });
      } else if (organicMatter < 4) {
        insights.push("Moderate organic matter - consider building levels");
      } else {
        insights.push("Good organic matter content");
      }
    }

    // Nutrient Balance Analysis
    const npRatio = nitrogen / phosphorus;
    if (npRatio > 4) {
      insights.push("High N:P ratio - phosphorus is limiting factor");
      recommendations.push("Balance fertilizer with higher phosphorus content");
    } else if (npRatio < 2) {
      insights.push("Low N:P ratio - nitrogen may be limiting");
    }

    const nkRatio = nitrogen / potassium;
    if (nkRatio > 2.5) {
      insights.push("High N:K ratio - increase potassium application");
    } else if (nkRatio < 1.5) {
      insights.push("Low N:K ratio - potassium levels adequate");
    }

    // Overall Health Score (0-100)
    const healthScore = this.calculateHealthScore(pH, nitrogen, phosphorus, potassium, moisture, organicMatter);

    return {
      healthScore,
      urgency: this.determineUrgency(insights, risks),
      insights,
      recommendations,
      risks,
      fertilizerRecommendations,
      immediateActions: immediateActions.length > 0 ? immediateActions : ["Continue current management practices"],
      cropSuggestions: this.suggestCrops(pH, nitrogen, phosphorus, potassium),
      optimalRanges: this.getOptimalRanges(),
      nextSteps: this.generateNextSteps(healthScore, urgency)
    };
  }

  static calculateHealthScore(pH, nitrogen, phosphorus, potassium, moisture, organicMatter) {
    let score = 100;

    // pH scoring (25 points max)
    if (pH >= 6.0 && pH <= 7.0) score += 0; // Optimal - no penalty
    else if (pH >= 5.5 && pH <= 7.5) score -= 5; // Acceptable
    else if (pH >= 5.0 && pH <= 8.0) score -= 15; // Marginal
    else score -= 25; // Poor

    // Nitrogen scoring (20 points max)
    if (nitrogen >= 40 && nitrogen <= 60) score += 0; // Optimal
    else if (nitrogen >= 25 && nitrogen <= 80) score -= 5; // Acceptable
    else if (nitrogen >= 15 && nitrogen <= 100) score -= 10; // Marginal
    else score -= 20; // Poor

    // Phosphorus scoring (20 points max)
    if (phosphorus >= 25 && phosphorus <= 50) score += 0; // Optimal
    else if (phosphorus >= 15 && phosphorus <= 60) score -= 5; // Acceptable
    else if (phosphorus >= 10 && phosphorus <= 70) score -= 10; // Marginal
    else score -= 20; // Poor

    // Potassium scoring (20 points max)
    if (potassium >= 30 && potassium <= 50) score += 0; // Optimal
    else if (potassium >= 20 && potassium <= 60) score -= 5; // Acceptable
    else if (potassium >= 15 && potassium <= 70) score -= 10; // Marginal
    else score -= 20; // Poor

    // Moisture scoring (10 points max - if provided)
    if (moisture !== undefined) {
      if (moisture >= 40 && moisture <= 70) score += 0; // Optimal
      else if (moisture >= 25 && moisture <= 80) score -= 3; // Acceptable
      else if (moisture >= 15 && moisture <= 85) score -= 6; // Marginal
      else score -= 10; // Poor
    }

    // Organic Matter scoring (5 points max - if provided)
    if (organicMatter !== undefined) {
      if (organicMatter >= 3) score += 0; // Good
      else if (organicMatter >= 2) score -= 2; // Moderate
      else score -= 5; // Poor
    }

    return Math.max(0, Math.min(100, Math.round(score)));
  }

  static determineUrgency(insights, risks) {
    const criticalTerms = ['severe', 'excess', 'toxicity', 'immediately', 'emergency', 'critical'];
    const warningTerms = ['deficiency', 'moderate', 'high', 'low', 'reduced'];
    
    const hasCritical = [...insights, ...risks].some(item => 
      criticalTerms.some(term => item.toLowerCase().includes(term))
    );
    
    const hasWarnings = [...insights, ...risks].some(item =>
      warningTerms.some(term => item.toLowerCase().includes(term))
    );

    if (hasCritical || risks.length > 2) return 'high';
    if (hasWarnings || insights.length > 3) return 'medium';
    return 'low';
  }

  static suggestCrops(pH, nitrogen, phosphorus, potassium) {
    const crops = [];

    // Acid-loving crops (pH 5.0-6.0)
    if (pH >= 5.0 && pH <= 6.0) {
      crops.push('Potatoes', 'Blueberries', 'Sweet Potatoes', 'Tomatoes', 'Peppers', 'Raspberries');
    }

    // Neutral pH crops (pH 6.0-7.0)
    if (pH >= 6.0 && pH <= 7.0) {
      crops.push('Corn', 'Beans', 'Cabbage', 'Carrots', 'Lettuce', 'Wheat', 'Barley', 'Cucumbers');
    }

    // Slightly alkaline crops (pH 7.0-7.5)
    if (pH >= 7.0 && pH <= 7.5) {
      crops.push('Asparagus', 'Beets', 'Broccoli', 'Cauliflower', 'Spinach', 'Celery');
    }

    // High nitrogen requirement crops
    if (nitrogen >= 40) {
      crops.push('Corn', 'Wheat', 'Leafy Greens', 'Cabbage', 'Lettuce', 'Grass', 'Broccoli');
    }

    // High phosphorus requirement crops
    if (phosphorus >= 25) {
      crops.push('Tomatoes', 'Peppers', 'Root Vegetables', 'Flowering Plants', 'Fruit Trees');
    }

    // High potassium requirement crops
    if (potassium >= 30) {
      crops.push('Fruit Trees', 'Grapes', 'Potatoes', 'Tomatoes', 'Beans', 'Squash');
    }

    // Remove duplicates and return top suggestions
    const uniqueCrops = [...new Set(crops)];
    return uniqueCrops.slice(0, 10);
  }

  static getOptimalRanges() {
    return {
      pH: { min: 6.0, max: 7.0, unit: 'pH' },
      nitrogen: { min: 40, max: 60, unit: 'ppm' },
      phosphorus: { min: 25, max: 50, unit: 'ppm' },
      potassium: { min: 30, max: 50, unit: 'ppm' },
      moisture: { min: 40, max: 70, unit: '%' },
      organicMatter: { min: 3, max: 5, unit: '%' },
      temperature: { min: 15, max: 30, unit: '°C' }
    };
  }

  static generateNextSteps(healthScore, urgency) {
    const steps = [];
    
    if (healthScore < 50) {
      steps.push(
        "Conduct detailed soil testing in different field zones",
        "Implement corrective measures based on specific deficiencies",
        "Consider professional agronomic consultation"
      );
    } else if (healthScore < 75) {
      steps.push(
        "Monitor soil parameters monthly",
        "Adjust fertilizer application based on crop growth stage",
        "Consider cover cropping to improve soil health"
      );
    } else {
      steps.push(
        "Continue regular soil monitoring",
        "Maintain current soil management practices",
        "Consider precision agriculture techniques for optimization"
      );
    }

    if (urgency === 'high') {
      steps.unshift("Take immediate corrective actions as recommended");
    }

    return steps;
  }

  // New method for generating seasonal recommendations
  static generateSeasonalRecommendations(season, readings) {
    const recommendations = [];
    
    switch (season.toLowerCase()) {
      case 'spring':
        recommendations.push("Prepare seedbed with proper tillage", "Apply pre-plant fertilizers");
        break;
      case 'summer':
        recommendations.push("Monitor soil moisture regularly", "Apply side-dress nitrogen if needed");
        break;
      case 'fall':
        recommendations.push("Apply lime or sulfur for pH adjustment", "Plant cover crops");
        break;
      case 'winter':
        recommendations.push("Plan next season's crop rotation", "Test soil in preparation for spring");
        break;
    }

    return recommendations;
  }
}

module.exports = SoilAI;