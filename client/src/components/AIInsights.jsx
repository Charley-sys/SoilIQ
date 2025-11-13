// client/src/components/AIInsights.jsx
import React from 'react';
import { SoilAI } from '../utils/aiInsightEngine.js';

const AIInsights = ({ soilReadings }) => {
  if (!soilReadings || soilReadings.length === 0) {
    return (
      <div className="ai-insights">
        <h2>AI Soil Analysis</h2>
        <div className="no-data">
          <p>No soil data available for analysis</p>
          <p>Add your first soil reading to get AI-powered insights</p>
        </div>
      </div>
    );
  }

  const latestReading = soilReadings[0];
  const analysis = SoilAI.analyzeSoil(latestReading);

  return (
    <div className="ai-insights">
      <h2>🤖 AI Soil Analysis</h2>
      
      {/* Health Score */}
      <div className="health-score-card">
        <h3>Soil Health Score</h3>
        <div className="score-circle">
          <span className="score">{analysis.healthScore}</span>
          <span className="score-label">/100</span>
        </div>
        <div className={`urgency-badge ${analysis.urgency}`}>
          {analysis.urgency.toUpperCase()} PRIORITY
        </div>
      </div>

      {/* Key Insights */}
      <div className="insights-section">
        <h3>🔍 Key Insights</h3>
        <div className="insights-list">
          {analysis.insights.map((insight, index) => (
            <div key={index} className="insight-item">
              {insight}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="recommendations-section">
        <h3>💡 Recommended Actions</h3>
        <div className="recommendations-list">
          {analysis.recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item">
              {rec}
            </div>
          ))}
        </div>
      </div>

      {/* Risks */}
      {analysis.risks.length > 0 && (
        <div className="risks-section">
          <h3>⚠️ Potential Risks</h3>
          <div className="risks-list">
            {analysis.risks.map((risk, index) => (
              <div key={index} className="risk-item">
                {risk}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crop Suggestions */}
      <div className="crops-section">
        <h3>🌱 Suitable Crops</h3>
        <div className="crops-grid">
          {analysis.cropSuggestions.map((crop, index) => (
            <span key={index} className="crop-tag">
              {crop}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;