import React from 'react';
import { useQuery } from 'react-query';
import { soilAPI, weatherAPI } from '../services/api';
import SoilMetrics from '../components/dashboard/SoilMetrics';
import RecentReadings from '../components/dashboard/RecentReadings';
import QuickStats from '../components/dashboard/QuickStats';
import WeatherCard from '../components/weather/WeatherCard';

const Dashboard = () => {
  const { data: soilData, isLoading: soilLoading } = useQuery(
    'soilReadings',
    soilAPI.getAll,
    { refetchInterval: 30000 }
  );

  const { data: weatherData, isLoading: weatherLoading } = useQuery(
    'weather',
    weatherAPI.getCurrent
  );

  const readings = soilData?.data?.readings || [];
  const latestReading = readings[readings.length - 1];

  return (
    <div className="space-y-8">
      {/* Quick Stats with more spacing */}
      <div className="mb-2">
        <QuickStats latestReading={latestReading} loading={soilLoading} />
      </div>
      
      {/* Main content grid with better gaps */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Soil Metrics Chart - takes 2/3 on large screens */}
        <div className="xl:col-span-2">
          <SoilMetrics readings={readings} loading={soilLoading} />
        </div>
        
        {/* Sidebar content - takes 1/3 on large screens */}
        <div className="space-y-8">
          <WeatherCard 
            weather={weatherData?.data?.weather} 
            loading={weatherLoading} 
          />
          <RecentReadings readings={readings.slice(-5)} loading={soilLoading} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;