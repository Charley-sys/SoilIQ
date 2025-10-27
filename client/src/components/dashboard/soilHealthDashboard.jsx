import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSoilData } from '../../hooks/useSoilData';
import SoilHealthCard from '../common/SoilHealthCard';
import AnalyticsCharts from './AnalyticsCharts';
import WeatherWidget from './WeatherWidget';
import FarmLocationMap from './FarmLocationMap';

const SoilHealthDashboard = () => {
  const { user, getActiveFarms } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d, 1y
  
  const activeFarms = getActiveFarms();
  
  // Use custom hook for soil data
  const { 
    soilData, 
    loading, 
    error, 
    averages, 
    trends,
    refreshData 
  } = useSoilData(selectedFarm?._id, timeRange);

  // Set default selected farm
  useEffect(() => {
    if (activeFarms.length > 0 && !selectedFarm) {
      setSelectedFarm(activeFarms[0]);
    }
  }, [activeFarms, selectedFarm]);

  // Calculate overall soil health score
  const calculateHealthScore = () => {
    if (!averages) return 0;
    
    const { pH, nitrogen, phosphorus, potassium, moisture, organicMatter } = averages;
    
    let score = 0;
    let factors = 0;

    // pH Score (optimal: 6.0-7.0)
    if (pH >= 6.0 && pH <= 7.0) score += 25;
    else if (pH >= 5.5 && pH <= 7.5) score += 15;
    else score += 5;
    factors++;

    // Nutrient Balance Score
    const nutrientAvg = (nitrogen + phosphorus + potassium) / 3;
    if (nutrientAvg >= 40 && nutrientAvg <= 80) score += 25;
    else if (nutrientAvg >= 20 && nutrientAvg <= 100) score += 15;
    else score += 5;
    factors++;

    // Moisture Score (optimal: 40-60%)
    if (moisture >= 40 && moisture <= 60) score += 25;
    else if (moisture >= 25 && moisture <= 75) score += 15;
    else score += 5;
    factors++;

    // Organic Matter Score (optimal: 3-5%)
    if (organicMatter >= 3 && organicMatter <= 5) score += 25;
    else if (organicMatter >= 2 && organicMatter <= 6) score += 15;
    else score += 5;
    factors++;

    return Math.round(score / factors);
  };

  const healthScore = calculateHealthScore();

  const getHealthStatus = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    return 'poor';
  };

  const healthStatus = getHealthStatus(healthScore);

  if (loading && !soilData) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading soil data...</p>
      </div>
    );
  }

  return (
    <div className="soil-health-dashboard">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1 className="h1">Soil Health Dashboard</h1>
          <p className="text-body">
            Monitor and analyze your soil conditions for optimal crop growth
          </p>
        </div>
        
        <div className="header-actions">
          <select 
            value={selectedFarm?._id || ''}
            onChange={(e) => {
              const farm = activeFarms.find(f => f._id === e.target.value);
              setSelectedFarm(farm);
            }}
            className="form-input"
            style={{ minWidth: '200px' }}
          >
            <option value="">Select a Farm</option>
            {activeFarms.map(farm => (
              <option key={farm._id} value={farm._id}>
                {farm.name} - {farm.cropType}
              </option>
            ))}
          </select>

          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="form-input"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>

          <button 
            onClick={refreshData}
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
          <button onClick={refreshData} className="btn btn-outline btn-sm">
            Retry
          </button>
        </div>
      )}

      {!selectedFarm ? (
        <div className="card">
          <div className="card-body text-center">
            <h3 className="h3">No Farm Selected</h3>
            <p className="text-body">
              Please select a farm to view soil health data, or add a new farm to get started.
            </p>
            <button className="btn btn-primary mt-4">
              Add Your First Farm
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <SoilHealthCard
              score={healthScore}
              status={healthStatus}
              title="Overall Soil Health"
              description="Based on pH, nutrients, moisture, and organic matter"
            />

            <div className="card">
              <div className="card-body">
                <h3 className="h3 text-param-ph">pH Level</h3>
                <div className="metric-value">
                  {averages?.pH ? averages.pH.toFixed(1) : '--'}
                </div>
                <div className={`health-indicator health-${getHealthStatus(
                  averages?.pH ? 
                    (averages.pH >= 6.0 && averages.pH <= 7.0) ? 80 :
                    (averages.pH >= 5.5 && averages.pH <= 7.5) ? 60 : 40
                  : 0
                )}`}>
                  {averages?.pH ? 
                    (averages.pH >= 6.0 && averages.pH <= 7.0) ? 'Optimal' :
                    (averages.pH >= 5.5 && averages.pH <= 7.5) ? 'Acceptable' : 'Needs Attention'
                  : 'No Data'}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="h3 text-param-moisture">Moisture</h3>
                <div className="metric-value">
                  {averages?.moisture ? `${averages.moisture.toFixed(1)}%` : '--'}
                </div>
                <div className={`health-indicator health-${getHealthStatus(
                  averages?.moisture ? 
                    (averages.moisture >= 40 && averages.moisture <= 60) ? 80 :
                    (averages.moisture >= 25 && averages.moisture <= 75) ? 60 : 40
                  : 0
                )}`}>
                  {averages?.moisture ? 
                    (averages.moisture >= 40 && averages.moisture <= 60) ? 'Optimal' :
                    (averages.moisture >= 25 && averages.moisture <= 75) ? 'Acceptable' : 'Needs Water'
                  : 'No Data'}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-body">
                <h3 className="h3 text-param-organic">Organic Matter</h3>
                <div className="metric-value">
                  {averages?.organicMatter ? `${averages.organicMatter.toFixed(1)}%` : '--'}
                </div>
                <div className={`health-indicator health-${getHealthStatus(
                  averages?.organicMatter ? 
                    (averages.organicMatter >= 3 && averages.organicMatter <= 5) ? 80 :
                    (averages.organicMatter >= 2 && averages.organicMatter <= 6) ? 60 : 40
                  : 0
                )}`}>
                  {averages?.organicMatter ? 
                    (averages.organicMatter >= 3 && averages.organicMatter <= 5) ? 'Optimal' :
                    (averages.organicMatter >= 2 && averages.organicMatter <= 6) ? 'Acceptable' : 'Needs Improvement'
                  : 'No Data'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Charts Section */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="card-header">
                  <h2 className="h2">Soil Analytics</h2>
                </div>
                <div className="card-body">
                  <AnalyticsCharts 
                    soilData={soilData}
                    timeRange={timeRange}
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <WeatherWidget 
                farm={selectedFarm}
              />
              
              <FarmLocationMap 
                farm={selectedFarm}
              />

              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="h3">Quick Actions</h3>
                </div>
                <div className="card-body space-y-3">
                  <button className="btn btn-primary w-full">
                    Add Soil Reading
                  </button>
                  <button className="btn btn-outline w-full">
                    Generate Report
                  </button>
                  <button className="btn btn-outline w-full">
                    View Recommendations
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Trends and Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Trends Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="h3">Recent Trends</h3>
              </div>
              <div className="card-body">
                {trends && Object.keys(trends).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(trends).map(([parameter, trend]) => (
                      <div key={parameter} className="trend-item">
                        <div className="flex justify-between items-center">
                          <span className="capitalize">{parameter}</span>
                          <span className={`trend-${trend.direction}`}>
                            {trend.direction === 'up' ? '↗' : 
                             trend.direction === 'down' ? '↘' : '→'}
                            {trend.percentage}%
                          </span>
                        </div>
                        <div className="text-small text-gray-600">
                          {trend.description}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body">No trend data available</p>
                )}
              </div>
            </div>

            {/* AI Recommendations Card */}
            <div className="card">
              <div className="card-header">
                <h3 className="h3">AI Recommendations</h3>
              </div>
              <div className="card-body">
                {soilData && soilData.length > 0 ? (
                  <div className="space-y-3">
                    <div className="recommendation-item">
                      <div className="flex items-start gap-3">
                        <div className="recommendation-icon">💡</div>
                        <div>
                          <div className="font-medium">Optimize pH Level</div>
                          <div className="text-small text-gray-600">
                            Consider adding lime to raise pH for better nutrient availability
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="recommendation-item">
                      <div className="flex items-start gap-3">
                        <div className="recommendation-icon">💧</div>
                        <div>
                          <div className="font-medium">Water Management</div>
                          <div className="text-small text-gray-600">
                            Soil moisture is optimal. Maintain current irrigation schedule.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-body">
                    Add soil readings to get personalized AI recommendations
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SoilHealthDashboard;