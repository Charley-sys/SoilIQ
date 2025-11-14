// server/utils/aiEngine.js
class SoilAI {
  static analyzeSoil(readings) {
    const { pH, nitrogen, phosphorus, potassium, temperature, moisture } = readings;
    
    const insights = [];
    const recommendations = [];
    const risks = [];
    const fertilizerRecommendations = [];

    // pH Analysis
    if (pH < 5.5) {
      insights.push("Soil is highly acidic - nutrient availability reduced");
      recommendations.push("Apply agricultural lime at 2-4 tons per hectare");
      fertilizerRecommendations.push({
        type: "Agricultural Lime",
        amount: "2-4 tons/hectare",
        timing: "Before planting season"
      });
      risks.push("Aluminum and manganese toxicity risk");
    } else if (pH < 6.0) {
      insights.push("Soil is moderately acidic - some nutrients may be limited");
      recommendations.push("Consider adding dolomitic lime if magnesium is also low");
    } else if (pH >= 6.0 && pH <= 7.0) {
      insights.push("Optimal pH range for most crops - excellent nutrient availability");
    } else if (pH > 7.5) {
      insights.push("Soil is alkaline - micronutrient deficiencies likely");
      recommendations.push("Apply sulfur or acidifying fertilizers");
      fertilizerRecommendations.push({
        type: "Elemental Sulfur",
        amount: "500-1000 kg/hectare",
        timing: "3-4 months before planting"
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
        timing: "Immediate application"
      });
      risks.push("Poor plant growth, yellowing leaves, reduced yield");
    } else if (nitrogen < 40) {
      insights.push("Moderate nitrogen deficiency");
      recommendations.push("Supplement with nitrogen fertilizer");
      fertilizerRecommendations.push({
        type: "Urea",
        amount: "50-100 kg N/hectare",
        timing: "Next application cycle"
      });
    } else if (nitrogen > 80) {
      insights.push("Excess nitrogen levels detected");
      recommendations.push("Reduce nitrogen application in next cycle");
      risks.push("Environmental pollution, excessive vegetative growth");
    }

    // Phosphorus Analysis
    if (phosphorus < 15) {
      insights.push("Severe phosphorus deficiency");
      recommendations.push("Apply phosphate fertilizers for root development");
      fertilizerRecommendations.push({
        type: "DAP or SSP",
        amount: "60-90 kg P₂O₅/hectare",
        timing: "At planting"
      });
      risks.push("Poor root development, delayed maturity");
    } else if (phosphorus < 25) {
      insights.push("Moderate phosphorus deficiency");
      recommendations.push("Supplement with phosphorus fertilizer");
    }

    // Potassium Analysis
    if (potassium < 20) {
      insights.push("Potassium deficiency detected");
      recommendations.push("Apply potash fertilizers for fruit quality and disease resistance");
      fertilizerRecommendations.push({
        type: "MOP (Muriate of Potash)",
        amount: "60-120 kg K₂O/hectare",
        timing: "Before flowering"
      });
      risks.push("Reduced fruit quality, increased disease susceptibility");
    }

    // Nutrient Balance Analysis
    const npRatio = nitrogen / phosphorus;
    if (npRatio > 4) {
      insights.push("High N:P ratio - phosphorus is limiting factor");
      recommendations.push("Balance fertilizer with higher phosphorus content");
    }

    const nkRatio = nitrogen / potassium;
    if (nkRatio > 2.5) {
      insights.push("High N:K ratio - increase potassium application");
    }

    // Overall Health Score (0-100)
    const healthScore = this.calculateHealthScore(pH, nitrogen, phosphorus, potassium);

    return {
      healthScore,
      urgency: this.determineUrgency(insights, risks),
      insights,
      recommendations,
      risks,
      fertilizerRecommendations,
      cropSuggestions: this.suggestCrops(pH, nitrogen, phosphorus, potassium)
    };
  }

  static calculateHealthScore(pH, nitrogen, phosphorus, potassium) {
    let score = 100;

    // pH scoring (40 points max)
    if (pH >= 6.0 && pH <= 7.0) score += 0; // Optimal - no penalty
    else if (pH >= 5.5 && pH <= 7.5) score -= 10; // Acceptable
    else if (pH >= 5.0 && pH <= 8.0) score -= 20; // Marginal
    else score -= 40; // Poor

    // Nitrogen scoring (20 points max)
    if (nitrogen >= 40 && nitrogen <= 60) score += 0; // Optimal
    else if (nitrogen >= 25 && nitrogen <= 80) score -= 5; // Acceptable
    else if (nitrogen >= 15 && nitrogen <= 100) score -= 10; // Marginal
    else score -= 20; // Poor

    // Phosphorus scoring (20 points max)
    if (phosphorus >= 30) score += 0; // Optimal
    else if (phosphorus >= 20) score -= 5; // Acceptable
    else if (phosphorus >= 10) score -= 10; // Marginal
    else score -= 20; // Poor

    // Potassium scoring (20 points max)
    if (potassium >= 30) score += 0; // Optimal
    else if (potassium >= 20) score -= 5; // Acceptable
    else if (potassium >= 10) score -= 10; // Marginal
    else score -= 20; // Poor

    return Math.max(0, Math.min(100, score));
  }

  static determineUrgency(insights, risks) {
    const criticalTerms = ['severe', 'excess', 'toxicity', 'immediately', 'emergency'];
    const hasCritical = [...insights, ...risks].some(item => 
      criticalTerms.some(term => item.toLowerCase().includes(term))
    );

    if (hasCritical || risks.length > 2) return 'high';
    if (insights.some(i => i.includes('deficiency') || i.includes('moderate'))) return 'medium';
    return 'low';
  }

  static suggestCrops(pH, nitrogen, phosphorus, potassium) {
    const crops = [];

    // Acid-loving crops (pH 5.0-6.0)
    if (pH >= 5.0 && pH <= 6.0) {
      crops.push('Potatoes', 'Blueberries', 'Sweet Potatoes', 'Tomatoes', 'Peppers');
    }

    // Neutral pH crops (pH 6.0-7.0)
    if (pH >= 6.0 && pH <= 7.0) {
      crops.push('Corn', 'Beans', 'Cabbage', 'Carrots', 'Lettuce', 'Wheat', 'Barley');
    }

    // Slightly alkaline crops (pH 7.0-7.5)
    if (pH >= 7.0 && pH <= 7.5) {
      crops.push('Asparagus', 'Beets', 'Broccoli', 'Cauliflower', 'Spinach');
    }

    // High nitrogen crops
    if (nitrogen >= 40) {
      crops.push('Corn', 'Wheat', 'Leafy Greens', 'Grass', 'Cabbage', 'Lettuce');
    }

    // High phosphorus crops
    if (phosphorus >= 25) {
      crops.push('Tomatoes', 'Peppers', 'Root Vegetables', 'Flowering Plants');
    }

    // High potassium crops
    if (potassium >= 30) {
      crops.push('Fruit Trees', 'Grapes', 'Potatoes', 'Tomatoes', 'Beans');
    }

    // Remove duplicates and return top suggestions
    return [...new Set(crops)].slice(0, 8);
  }
}

module.exports = SoilAI;