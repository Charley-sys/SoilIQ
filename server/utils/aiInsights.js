// server/utils/aiInsights.js

function generateAIInsights(soilData = {}, weatherData = {}) {
  const insights = [];
  const recommendations = [];

  // --- pH Analysis ---
  if (soilData.pH !== undefined) {
    if (soilData.pH < 6) {
      insights.push("Soil is acidic. Consider adding lime.");
      recommendations.push("Apply agricultural lime (2–3 tons/hectare).");
    } else if (soilData.pH > 7.5) {
      insights.push("Soil is alkaline.");
      recommendations.push("Use elemental sulfur or acidifying fertilizer.");
    } else {
      insights.push("Soil pH is optimal for most crops.");
    }
  }

  // --- Nutrient Analysis ---
  if (soilData.nitrogen !== undefined && soilData.nitrogen < 20)
    recommendations.push("Add nitrogen fertilizer (e.g., urea).");

  if (soilData.phosphorus !== undefined && soilData.phosphorus < 15)
    recommendations.push("Add phosphate fertilizer or compost.");

  if (soilData.potassium !== undefined && soilData.potassium < 150)
    recommendations.push("Add potassium chloride or wood ash.");

  // --- Organic Matter ---
  if (soilData.organicMatter !== undefined && soilData.organicMatter < 3)
    recommendations.push("Incorporate compost or manure (5–10 tons/hectare).");

  // --- Moisture ---
  if (soilData.moisture !== undefined) {
    if (soilData.moisture < 15)
      recommendations.push("Implement drip irrigation system.");
    else if (soilData.moisture > 40)
      recommendations.push("Improve soil drainage to prevent waterlogging.");
  }

  // --- Texture ---
  if (soilData.texture === "clay")
    recommendations.push("Mix sand and compost to improve aeration.");

  // --- Weather-based Advice ---
  if (weatherData.temperature > 35)
    recommendations.push("High temperature detected: increase irrigation frequency.");

  if (weatherData.rainfall > 50)
    recommendations.push("Heavy rainfall detected: ensure adequate drainage.");

  // --- Final Return ---
  return {
    insights:
      insights.length > 0
        ? insights.join(" ")
        : "Soil conditions are generally good.",
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ["Monitor soil conditions regularly."],
  };
}

module.exports = generateAIInsights;
