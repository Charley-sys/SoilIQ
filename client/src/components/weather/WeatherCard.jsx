import React from 'react';

const WeatherCard = ({ weather, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weather</h3>
        <p className="text-gray-500">Weather data unavailable</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">Current Weather</h3>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span>Location:</span>
          <span className="font-medium">{weather.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Temperature:</span>
          <span className="font-medium">{weather.temperature}°C</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Conditions:</span>
          <span className="font-medium">{weather.conditions}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Humidity:</span>
          <span className="font-medium">{weather.humidity}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Soil Condition:</span>
          <span className="font-medium">{weather.soilConditions?.moisture || 'Normal'}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;