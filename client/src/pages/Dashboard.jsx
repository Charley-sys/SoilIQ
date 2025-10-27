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
    <div className="space-y-10"> {/* Increased spacing */}
      {/* Quick Stats */}
      <QuickStats latestReading={latestReading} loading={soilLoading} />
      
      {/* Main content grid with much larger gaps */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10"> {/* Increased gap */}
        {/* Soil Metrics Chart */}
        <div className="xl:col-span-2">
          <SoilMetrics readings={readings} loading={soilLoading} />
        </div>
        
        {/* Sidebar content */}
        <div className="space-y-10"> {/* Increased spacing */}
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