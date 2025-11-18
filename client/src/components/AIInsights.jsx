// client/src/components/AIInsights.jsx
import React from 'react';

const AIInsights = ({ soilReadings = [] }) => {
  // If no soil readings, show empty state
  if (!soilReadings || soilReadings.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>AI Soil Analysis</h3>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          No soil data available for analysis
        </p>
        <p style={{ color: '#9ca3af' }}>
          Add your first soil reading to get AI-powered insights
        </p>
      </div>
    );
  }

  const latestReading = soilReadings[0];
  
  // Generate insights based on the latest reading
  const generateInsights = (reading) => {
    const insights = {
      healthScore: Math.min(100, Math.max(0, 
        100 - 
        Math.abs(reading.pH - 6.5) * 10 -
        Math.max(0, 40 - reading.nitrogen) * 0.5 -
        Math.max(0, 25 - reading.phosphorus) * 0.5 -
        Math.max(0, 30 - reading.potassium) * 0.5
      )),
      insights: [],
      recommendations: [],
      risks: [],
      cropSuggestions: []
    };

    // Always provide some insights and recommendations
    insights.insights.push(`Current pH level: ${reading.pH.toFixed(1)}`);
    insights.insights.push(`Nitrogen levels: ${Math.round(reading.nitrogen)} ppm`);
    insights.insights.push(`Phosphorus levels: ${Math.round(reading.phosphorus)} ppm`);
    insights.insights.push(`Potassium levels: ${Math.round(reading.potassium)} ppm`);

    // pH Analysis - Always provide pH recommendation
    if (reading.pH < 6.0) {
      insights.insights.push("Soil is slightly acidic");
      insights.recommendations.push("Apply agricultural lime to raise pH to optimal range (6.0-7.0)");
    } else if (reading.pH > 7.5) {
      insights.insights.push("Soil is alkaline");
      insights.recommendations.push("Consider sulfur application to lower pH to optimal range");
    } else {
      insights.insights.push("pH is in optimal range for most crops");
      insights.recommendations.push("Maintain current pH levels with regular monitoring");
    }

    // Nitrogen Analysis
    if (reading.nitrogen < 25) {
      insights.insights.push("Low nitrogen levels detected");
      insights.recommendations.push("Apply nitrogen-rich fertilizer (urea or ammonium nitrate)");
      insights.risks.push("Reduced plant growth and yellowing leaves");
    } else if (reading.nitrogen > 80) {
      insights.insights.push("High nitrogen levels detected");
      insights.recommendations.push("Reduce nitrogen application in next cycle");
      insights.risks.push("Potential for nutrient runoff and environmental impact");
    } else {
      insights.insights.push("Nitrogen levels are adequate");
      insights.recommendations.push("Continue current nitrogen management practices");
    }

    // Phosphorus Analysis
    if (reading.phosphorus < 20) {
      insights.insights.push("Phosphorus levels are low");
      insights.recommendations.push("Add phosphate fertilizer (DAP or SSP) for root development");
    } else if (reading.phosphorus > 60) {
      insights.insights.push("High phosphorus levels");
      insights.recommendations.push("Monitor for zinc and iron deficiencies");
    } else {
      insights.insights.push("Phosphorus levels are sufficient");
    }

    // Potassium Analysis
    if (reading.potassium < 25) {
      insights.insights.push("Potassium deficiency detected");
      insights.recommendations.push("Apply potash (MOP) for fruit quality and disease resistance");
    } else if (reading.potassium > 60) {
      insights.insights.push("High potassium levels");
      insights.recommendations.push("Monitor magnesium uptake");
    } else {
      insights.insights.push("Potassium levels are adequate");
    }

    // Additional moisture recommendations if available
    if (reading.moisture !== undefined) {
      if (reading.moisture < 30) {
        insights.recommendations.push("Increase irrigation - soil moisture is low");
      } else if (reading.moisture > 80) {
        insights.recommendations.push("Improve drainage - soil moisture is excessive");
      }
    }

    // Crop suggestions based on conditions - Always suggest some crops
    if (reading.pH >= 5.5 && reading.pH <= 7.5) {
      insights.cropSuggestions.push('Tomatoes', 'Corn', 'Beans', 'Lettuce');
    }
    if (reading.nitrogen >= 30) {
      insights.cropSuggestions.push('Leafy Greens', 'Cabbage', 'Broccoli');
    }
    if (reading.phosphorus >= 20) {
      insights.cropSuggestions.push('Root Vegetables', 'Flowering Plants');
    }
    if (reading.potassium >= 25) {
      insights.cropSuggestions.push('Fruit Trees', 'Grapes', 'Potatoes');
    }

    // Add some default crops if no specific ones matched
    if (insights.cropSuggestions.length === 0) {
      insights.cropSuggestions.push('Wheat', 'Barley', 'Oats', 'Legumes');
    }

    // Remove duplicates
    insights.cropSuggestions = [...new Set(insights.cropSuggestions)].slice(0, 6);

    // Determine urgency
    if (insights.risks.length > 0 || reading.pH < 5.0 || reading.pH > 8.5) {
      insights.urgency = 'high';
    } else if (insights.recommendations.length > 2) {
      insights.urgency = 'medium';
    } else {
      insights.urgency = 'low';
    }

    return insights;
  };

  const analysis = generateInsights(latestReading);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div>
      <h2 style={{ 
        textAlign: 'center',
        marginBottom: '3rem',
        color: '#1f2937',
        fontSize: '2rem'
      }}>
        AI Soil Analysis
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        {/* Health Overview */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Soil Health Score</h3>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#10b981',
            marginBottom: '0.5rem'
          }}>
            {Math.round(analysis.healthScore)}/100
          </div>
          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: getUrgencyColor(analysis.urgency),
            color: 'white',
            borderRadius: '20px',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            {analysis.urgency.toUpperCase()} PRIORITY
          </div>
        </div>

        {/* Recommended Crops */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#374151' }}>Recommended Crops</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {analysis.cropSuggestions.map((crop, index) => (
              <span
                key={index}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#dcfce7',
                  color: '#166534',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                {crop}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '2rem'
      }}>
        {/* Key Insights */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem',
            color: '#3b82f6'
          }}>
            Key Insights
          </h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {analysis.insights.map((insight, index) => (
              <li key={index} style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#eff6ff',
                borderRadius: '6px',
                borderLeft: '4px solid #3b82f6'
              }}>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      
        {/* Recommendations */}
        <div style={{
          background: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ 
            marginBottom: '1.5rem',
            color: '#10b981'
          }}>
            Recommended Actions
          </h3>
          {analysis.recommendations.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: '#f0fdf4',
                  borderRadius: '6px',
                  borderLeft: '4px solid #10b981'
                }}>
                  {recommendation}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: '#6b7280', fontStyle: 'italic' }}>
              No specific recommendations needed. Your soil parameters are well-balanced.
            </p>
          )}
        </div>

        {/* Risks */}
        {analysis.risks.length > 0 && (
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h3 style={{ 
              marginBottom: '1.5rem',
              color: '#ef4444'
            }}>
              Potential Risks
            </h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {analysis.risks.map((risk, index) => (
                <li key={index} style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: '#fef2f2',
                  borderRadius: '6px',
                  borderLeft: '4px solid #ef4444'
                }}>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;