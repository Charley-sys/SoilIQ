import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { soilAPI, weatherAPI } from '../services/api';
import SoilMetrics from '../components/dashboard/SoilMetrics';
import RecentReadings from '../components/dashboard/RecentReadings';
import QuickStats from '../components/dashboard/QuickStats';
import WeatherCard from '../components/weather/WeatherCard';

const Dashboard = () => {
  const [showFarmForm, setShowFarmForm] = useState(false);
  const [farmName, setFarmName] = useState('My First Farm');
  const [creatingFarm, setCreatingFarm] = useState(false);

  const { data: soilData, isLoading: soilLoading, refetch: refetchSoil } = useQuery(
    'soilReadings',
    soilAPI.getAll,
    { refetchInterval: 30000 }
  );

  const { data: weatherData, isLoading: weatherLoading } = useQuery(
    'weather',
    weatherAPI.getCurrent
  );

  const createTestFarm = async () => {
    setCreatingFarm(true);
    try {
      const farmData = {
        name: farmName,
        location: 'Test Location',
        cropType: 'wheat',
        size: 5,
        soilType: 'loam'
      };

      const response = await fetch('http://localhost:5000/api/farms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(farmData)
      });

      if (response.ok) {
        const newFarm = await response.json();
        console.log('Farm created:', newFarm);
        alert(`Farm "${farmName}" created successfully! You can now add soil readings.`);
        setShowFarmForm(false);
        setFarmName('My First Farm');
        // Refresh the page to load the new farm
        window.location.reload();
      } else {
        throw new Error('Failed to create farm');
      }
    } catch (error) {
      console.error('Error creating farm:', error);
      alert('Error creating farm. Please check the console for details.');
    } finally {
      setCreatingFarm(false);
    }
  };

  const readings = soilData?.data?.readings || [];
  const latestReading = readings[readings.length - 1];

  return (
    <div className="space-y-10">
      {/* Farm Creation Banner - Only show if no readings exist */}
      {readings.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                🚜 Welcome to SoilIQ!
              </h3>
              <p className="text-blue-700">
                Start by creating your first farm to begin monitoring soil health.
              </p>
            </div>
            
            {!showFarmForm ? (
              <button
                onClick={() => setShowFarmForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Create Your First Farm
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Enter farm name"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={createTestFarm}
                  disabled={creatingFarm || !farmName.trim()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-semibold"
                >
                  {creatingFarm ? 'Creating...' : 'Create Farm'}
                </button>
                <button
                  onClick={() => setShowFarmForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <QuickStats latestReading={latestReading} loading={soilLoading} />
      
      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Soil Metrics Chart */}
        <div className="xl:col-span-2">
          <SoilMetrics readings={readings} loading={soilLoading} />
        </div>
        
        {/* Sidebar content */}
        <div className="space-y-10">
          <WeatherCard 
            weather={weatherData?.data?.weather} 
            loading={weatherLoading} 
          />
          <RecentReadings readings={readings.slice(-5)} loading={soilLoading} />
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      <div className="bg-gray-100 p-4 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">Debug Info:</h4>
        <p>Total Readings: {readings.length}</p>
        <p>Latest Reading: {latestReading ? 'Available' : 'None'}</p>
      </div>
    </div>
  );
};

export default Dashboard;