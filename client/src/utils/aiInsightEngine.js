// client/src/utils/aiInsightEngine.js

// AI Soil Analysis Engine
export class SoilAI {
  static analyzeSoil(readings) {
    const { pH, nitrogen, phosphorus, potassium, temperature, moisture } = readings;
    
    const insights = [];
    const recommendations = [];
    const risks = [];

    // pH Analysis
    if (pH < 5.5) {
      insights.push("Soil is highly acidic");
      recommendations.push("Apply agricultural lime to raise pH level");
      risks.push("Nutrient lockup in acidic soil");
    } else if (pH < 6.0) {
      insights.push("Soil is moderately acidic");
      recommendations.push("Consider adding dolomitic lime");
    } else if (pH >= 6.0 && pH <= 7.0) {
      insights.push("Optimal pH range for most crops");
    } else if (pH > 7.5) {
      insights.push("Soil is alkaline");
      recommendations.push("Apply sulfur or acidifying fertilizers");
      risks.push("Reduced micronutrient availability");
    }

    // NPK Analysis
    if (nitrogen < 25) {
      insights.push("Nitrogen deficiency detected");
      recommendations.push("Apply nitrogen-rich fertilizer (Urea, Ammonium Nitrate)");
      risks.push("Poor plant growth and yellowing leaves");
    } else if (nitrogen > 60) {
      insights.push("Excess nitrogen levels");
      recommendations.push("Reduce nitrogen application");
      risks.push("Potential for nutrient runoff and environmental damage");
    }

    if (phosphorus < 20) {
      insights.push("Phosphorus deficiency");
      recommendations.push("Apply phosphate fertilizers (DAP, SSP)");
      risks.push("Poor root development and flowering");
    }

    if (potassium < 25) {
      insights.push("Potassium deficiency");
      recommendations.push("Apply potash fertilizers (MOP, SOP)");
      risks.push("Reduced disease resistance and fruit quality");
    }

    // Nutrient Balance Analysis
    const npRatio = nitrogen / phosphorus;
    if (npRatio > 3) {
      insights.push("High N:P ratio - phosphorus may be limiting");
      recommendations.push("Balance fertilizer application with more phosphorus");
    }

    const nkRatio = nitrogen / potassium;
    if (nkRatio > 2) {
      insights.push("High N:K ratio - potassium may be limiting");
      recommendations.push("Increase potassium application");
    }

    // Overall Soil Health Score (0-100)
    const healthScore = this.calculateHealthScore(pH, nitrogen, phosphorus, potassium);

    return {
      insights,
      recommendations,
      risks,
      healthScore,
      urgency: this.determineUrgency(insights, risks),
      cropSuggestions: this.suggestCrops(pH, nitrogen, phosphorus, potassium)
    };
  }

  static calculateHealthScore(pH, nitrogen, phosphorus, potassium) {
    let score = 100;

    // pH penalty
    if (pH < 5.5 || pH > 7.5) score -= 30;
    else if (pH < 6.0 || pH > 7.0) score -= 15;

    // Nutrient penalties
    if (nitrogen < 25) score -= 20;
    if (phosphorus < 20) score -= 15;
    if (potassium < 25) score -= 15;

    // Bonus for optimal ranges
    if (pH >= 6.0 && pH <= 7.0) score += 10;
    if (nitrogen >= 40 && nitrogen <= 60) score += 10;
    if (phosphorus >= 30) score += 5;
    if (potassium >= 30) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  static determineUrgency(insights, risks) {
    if (risks.length > 0) return 'high';
    if (insights.some(i => i.includes('deficiency') || i.includes('Excess'))) return 'medium';
    return 'low';
  }

  static suggestCrops(pH, nitrogen, phosphorus, potassium) {
    const crops = [];

    // Acid-loving crops
    if (pH >= 5.0 && pH <= 6.0) {
      crops.push('Potatoes', 'Blueberries', 'Sweet Potatoes', 'Tomatoes');
    }

    // Neutral pH crops
    if (pH >= 6.0 && pH <= 7.0) {
      crops.push('Corn', 'Beans', 'Cabbage', 'Carrots', 'Lettuce');
    }

    // High nitrogen crops
    if (nitrogen >= 40) {
      crops.push('Corn', 'Wheat', 'Leafy Greens', 'Grass');
    }

    // High phosphorus crops
    if (phosphorus >= 25) {
      crops.push('Tomatoes', 'Peppers', 'Root Vegetables');
    }

    // High potassium crops
    if (potassium >= 30) {
      crops.push('Fruit Trees', 'Grapes', 'Potatoes', 'Tomatoes');
    }

    // Remove duplicates and return
    return [...new Set(crops)].slice(0, 6);
  }
}