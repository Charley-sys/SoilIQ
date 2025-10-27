import React from 'react';

const QuickStats = ({ latestReading, loading }) => {
  const stats = [
    {
      name: 'Soil Moisture',
      value: latestReading ? `${latestReading.moisture}%` : '--',
      status: latestReading ? 
        (latestReading.moisture > 60 ? 'optimal' : 
         latestReading.moisture > 40 ? 'moderate' : 'dry') : 'unknown',
      icon: '💧',
      color: 'blue'
    },
    {
      name: 'pH Level',
      value: latestReading ? latestReading.ph : '--',
      status: latestReading ? 
        (latestReading.ph > 6.5 ? 'alkaline' : 
         latestReading.ph > 5.5 ? 'neutral' : 'acidic') : 'unknown',
      icon: '🧪',
      color: 'green'
    },
    {
      name: 'Temperature',
      value: latestReading ? `${latestReading.temperature}°C` : '--',
      status: latestReading ? 
        (latestReading.temperature > 25 ? 'warm' : 
         latestReading.temperature > 15 ? 'optimal' : 'cool') : 'unknown',
      icon: '🌡️',
      color: 'orange'
    },
    {
      name: 'Readings Today',
      value: '1',
      status: 'normal',
      icon: '📊',
      color: 'purple'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className={`text-xs font-medium px-2 py-1 rounded-full inline-block ${
                stat.status === 'optimal' || stat.status === 'neutral' ? 'bg-green-100 text-green-800' :
                stat.status === 'moderate' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}
              </p>
            </div>
            <div className="text-3xl ml-4 opacity-80">{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;