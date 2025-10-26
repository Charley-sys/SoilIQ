import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import SoilHealthDashboard from '../components/dashboard/soilHealthDashboard';
import AdvancedAnalytics from '../components/analytics/AdvancedAnalytics';
import RealTimeMetrics from '../components/dashboard/RealTimeMetrics';
import RealTimeDashboard from '../components/dashboard/RealTimeDashboard';

const Dashboard = () => {
  const { user, getActiveFarms } = useAuth();
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'analytics', 'realtime'
  const activeFarms = getActiveFarms();

  // Set default selected farm
  useEffect(() => {
    if (activeFarms.length > 0 && !selectedFarm) {
      setSelectedFarm(activeFarms[0]);
    }
  }, [activeFarms, selectedFarm]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
        <span className="ml-2 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="h1">Farm Dashboard</h1>
            <p className="text-body text-gray-600">
              Monitor and analyze your soil health in real-time
            </p>
          </div>
          
          {/* Farm Selector and View Toggles */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Farm Selector */}
            <select 
              value={selectedFarm?._id || ''}
              onChange={(e) => {
                const farm = activeFarms.find(f => f._id === e.target.value);
                setSelectedFarm(farm);
              }}
              className="form-input min-w-[200px]"
            >
              <option value="">Select a Farm</option>
              {activeFarms.map(farm => (
                <option key={farm._id} value={farm._id}>
                  {farm.name} - {farm.cropType}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveView('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'overview'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveView('analytics')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'analytics'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📈 Analytics
              </button>
              <button
                onClick={() => setActiveView('realtime')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'realtime'
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⚡ Live Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message for New Users */}
      {activeFarms.length === 0 && (
        <div className="card bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-8">
          <div className="card-body text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h2 className="h2 mb-2">Welcome to SoilIQ!</h2>
            <p className="text-body text-gray-700 mb-4">
              Get started by adding your first farm and soil readings to unlock powerful analytics and insights.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary">
                Add Your First Farm
              </button>
              <button className="btn btn-outline">
                Take a Tour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      {!selectedFarm ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="text-4xl mb-4">🏠</div>
            <h3 className="h3 mb-2">No Farm Selected</h3>
            <p className="text-body text-gray-600 mb-6">
              Please select a farm to view dashboard data
            </p>
            {activeFarms.length === 0 && (
              <button className="btn btn-primary">
                Create Your First Farm
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* View-based Content */}
          {activeView === 'overview' && (
            <>
              <SoilHealthDashboard />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RealTimeMetrics farmId={selectedFarm._id} />
                <RealTimeDashboard farmId={selectedFarm._id} />
              </div>
            </>
          )}

          {activeView === 'analytics' && (
            <AdvancedAnalytics farmId={selectedFarm._id} />
          )}

          {activeView === 'realtime' && (
            <div className="space-y-6">
              <RealTimeDashboard farmId={selectedFarm._id} />
              <RealTimeMetrics farmId={selectedFarm._id} />
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card text-center">
                  <div className="card-body">
                    <div className="text-2xl font-bold text-green-600">24/7</div>
                    <div className="text-sm text-gray-600">Live Monitoring</div>
                  </div>
                </div>
                <div className="card text-center">
                  <div className="card-body">
                    <div className="text-2xl font-bold text-blue-600">≤30s</div>
                    <div className="text-sm text-gray-600">Update Delay</div>
                  </div>
                </div>
                <div className="card text-center">
                  <div className="card-body">
                    <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    <div className="text-sm text-gray-600">Uptime</div>
                  </div>
                </div>
                <div className="card text-center">
                  <div className="card-body">
                    <div className="text-2xl font-bold text-orange-600">Auto</div>
                    <div className="text-sm text-gray-600">Alerts</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Farm Information Card */}
          <div className="card">
            <div className="card-header">
              <h3 className="h3">Farm Information</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-gray-500">Farm Name</div>
                  <div className="font-semibold text-gray-900">{selectedFarm.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Crop Type</div>
                  <div className="font-semibold text-gray-900">{selectedFarm.cropType}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Soil Type</div>
                  <div className="font-semibold text-gray-900 capitalize">
                    {selectedFarm.soilType || 'Not specified'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Farm Size</div>
                  <div className="font-semibold text-gray-900">
                    {selectedFarm.farmSize?.value} {selectedFarm.farmSize?.unit}
                  </div>
                </div>
              </div>
              
              {selectedFarm.location?.address && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold text-gray-900">
                    {selectedFarm.location.address}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 justify-center">
          <button className="btn btn-outline">
            📥 Export Data
          </button>
          <button className="btn btn-outline">
            📋 Generate Report
          </button>
          <button className="btn btn-outline">
            🔔 Notification Settings
          </button>
          <button className="btn btn-primary">
            ➕ Add Soil Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;