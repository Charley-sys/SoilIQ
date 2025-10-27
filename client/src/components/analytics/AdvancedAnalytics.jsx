import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

const AdvancedAnalytics = ({ farmId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (farmId) {
      fetchAnalytics();
    }
  }, [farmId, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/analytics/comprehensive/${farmId}`, {
        params: { period: timeRange }
      });
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-12">
            <div className="spinner"></div>
            <span className="ml-3 text-gray-600">Loading advanced analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
            <p>Add more soil readings to generate comprehensive analytics</p>
          </div>
        </div>
      </div>
    );
  }

  const { summary, trends, correlations, seasonalPatterns, predictions, recommendations, riskAssessment } = analytics;

  // Chart data preparation
  const parameterTrendData = Object.entries(summary).map(([param, data]) => ({
    parameter: param,
    average: data.average,
    stability: data.stability * 100,
    trend: data.trend === 'increasing' ? 1 : data.trend === 'decreasing' ? -1 : 0
  }));

  const correlationData = Object.entries(correlations).map(([pair, data]) => ({
    pair: pair.replace('_', ' vs '),
    correlation: data.correlation,
    strength: data.strength
  }));

  const riskData = Object.entries(riskAssessment.riskByCategory).map(([category, risks]) => ({
    category,
    count: risks.length,
    maxSeverity: Math.max(...risks.map(r => r.level === 'high' ? 3 : r.level === 'medium' ? 2 : 1))
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="h2">Advanced Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="form-input w-auto"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'trends', 'correlations', 'seasonal', 'predictions', 'risks', 'recommendations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Health Score */}
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {summary.healthScore}
              </div>
              <div className="text-sm text-gray-600">Overall Health Score</div>
              <div className={`health-indicator health-${
                summary.healthScore >= 80 ? 'excellent' :
                summary.healthScore >= 60 ? 'good' :
                summary.healthScore >= 40 ? 'fair' : 'poor'
              } mt-2`}>
                {summary.healthScore >= 80 ? 'Excellent' :
                 summary.healthScore >= 60 ? 'Good' :
                 summary.healthScore >= 40 ? 'Fair' : 'Needs Attention'}
              </div>
            </div>
          </div>

          {/* Parameter Stability */}
          <div className="card lg:col-span-2">
            <div className="card-header">
              <h3 className="h3">Parameter Stability</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={parameterTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="parameter" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stability" fill="#4ADE80" name="Stability %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Overview */}
          <div className="card">
            <div className="card-header">
              <h3 className="h3">Risk Assessment</h3>
            </div>
            <div className="card-body">
              <div className={`text-2xl font-bold mb-2 ${
                riskAssessment.overallRiskLevel === 'high' ? 'text-red-600' :
                riskAssessment.overallRiskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {riskAssessment.overallRiskLevel.toUpperCase()}
              </div>
              <div className="text-sm text-gray-600">Overall Risk Level</div>
              <div className="mt-4 space-y-2">
                {riskData.map((risk, index) => (
                  <div key={risk.category} className="flex justify-between items-center">
                    <span className="text-sm capitalize">{risk.category}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      risk.maxSeverity === 3 ? 'bg-red-100 text-red-800' :
                      risk.maxSeverity === 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {risk.count} risks
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations Summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="h3">Action Items</h3>
            </div>
            <div className="card-body">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">High Priority</span>
                  <span className="text-red-600 font-semibold">
                    {recommendations.summary.priorityBreakdown.high || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Medium Priority</span>
                  <span className="text-yellow-600 font-semibold">
                    {recommendations.summary.priorityBreakdown.medium || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Low Priority</span>
                  <span className="text-green-600 font-semibold">
                    {recommendations.summary.priorityBreakdown.low || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seasonal Patterns */}
          <div className="card">
            <div className="card-header">
              <h3 className="h3">Seasonal Insights</h3>
            </div>
            <div className="card-body">
              {Object.entries(seasonalPatterns).map(([param, pattern]) => (
                pattern.hasSeasonality && (
                  <div key={param} className="mb-3 last:mb-0">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium capitalize">{param}</span>
                      <span className="text-green-600">Seasonal</span>
                    </div>
                  </div>
                )
              ))}
              {!Object.values(seasonalPatterns).some(p => p.hasSeasonality) && (
                <div className="text-center text-gray-500 text-sm">
                  No strong seasonal patterns detected
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(trends).map(([parameter, trend]) => (
            <div key={parameter} className="card">
              <div className="card-header">
                <h3 className="h3 capitalize">{parameter} Trend</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <div className="text-gray-600">Direction</div>
                    <div className={`font-semibold ${
                      trend.direction === 'up' ? 'text-green-600' :
                      trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {trend.direction.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Confidence</div>
                    <div className="font-semibold">
                      {(trend.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div 
                    className={`h-2 rounded-full ${
                      trend.direction === 'up' ? 'bg-green-500' :
                      trend.direction === 'down' ? 'bg-red-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${Math.abs(trend.slope) * 1000}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Correlations Tab */}
      {activeTab === 'correlations' && (
        <div className="card">
          <div className="card-header">
            <h3 className="h3">Parameter Correlations</h3>
          </div>
          <div className="card-body">
            {correlationData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {correlationData.map((item, index) => (
                  <div key={item.pair} className="border rounded-lg p-4">
                    <div className="font-semibold text-sm mb-2">{item.pair}</div>
                    <div className={`text-lg font-bold ${
                      Math.abs(item.correlation) > 0.7 ? 'text-green-600' :
                      Math.abs(item.correlation) > 0.4 ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {item.correlation.toFixed(3)}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">{item.strength}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {correlations[item.pair.replace(' vs ', '_')]?.interpretation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                No significant correlations detected
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {/* High Priority */}
          {recommendations.recommendations
            .filter(rec => rec.priority === 'high')
            .map((recommendation, index) => (
              <div key={index} className="card border-red-200 bg-red-50">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          HIGH PRIORITY
                        </span>
                        <h3 className="font-semibold text-red-900">{recommendation.title}</h3>
                      </div>
                      <p className="text-red-800 mb-3">{recommendation.message}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-red-700 font-medium">Action</div>
                          <div className="text-red-600">{recommendation.action}</div>
                        </div>
                        <div>
                          <div className="text-red-700 font-medium">Timing</div>
                          <div className="text-red-600">{recommendation.timing}</div>
                        </div>
                        <div>
                          <div className="text-red-700 font-medium">Expected Impact</div>
                          <div className="text-red-600">{recommendation.expectedImprovement}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Medium Priority */}
          {recommendations.recommendations
            .filter(rec => rec.priority === 'medium')
            .map((recommendation, index) => (
              <div key={index} className="card border-yellow-200 bg-yellow-50">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          MEDIUM PRIORITY
                        </span>
                        <h3 className="font-semibold text-yellow-900">{recommendation.title}</h3>
                      </div>
                      <p className="text-yellow-800 mb-3">{recommendation.message}</p>
                      <div className="text-sm text-yellow-700">
                        <strong>Action:</strong> {recommendation.action}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Low Priority */}
          {recommendations.recommendations
            .filter(rec => rec.priority === 'low')
            .map((recommendation, index) => (
              <div key={index} className="card border-green-200 bg-green-50">
                <div className="card-body">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          LOW PRIORITY
                        </span>
                        <h3 className="font-semibold text-green-900">{recommendation.title}</h3>
                      </div>
                      <p className="text-green-800">{recommendation.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Other tabs would follow similar patterns */}
    </div>
  );
};

export default AdvancedAnalytics;