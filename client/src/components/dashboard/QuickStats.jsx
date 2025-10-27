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
    },
    {
      name: 'pH Level',
      value: latestReading ? latestReading.ph : '--',
      status: latestReading ? 
        (latestReading.ph > 6.5 ? 'alkaline' : 
         latestReading.ph > 5.5 ? 'neutral' : 'acidic') : 'unknown',
      icon: '🧪',
    },
    {
      name: 'Temperature',
      value: latestReading ? `${latestReading.temperature}°C` : '--',
      status: latestReading ? 
        (latestReading.temperature > 25 ? 'warm' : 
         latestReading.temperature > 15 ? 'optimal' : 'cool') : 'unknown',
      icon: '🌡️',
    },
    {
      name: 'Readings Today',
      value: '1',
      status: 'normal',
      icon: '📊',
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8"> {/* Increased gap */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-pulse"> {/* Increased padding, rounded corners */}
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8"> {/* Increased gap */}
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"> {/* Increased padding, rounded corners */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-lg font-medium text-gray-600 mb-3">{stat.name}</p> {/* Larger text */}
              <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p> {/* Larger text */}
              <p className={`text-sm font-medium px-3 py-1.5 rounded-full inline-block ${
                stat.status === 'optimal' || stat.status === 'neutral' ? 'bg-green-100 text-green-800 border border-green-200' :
                stat.status === 'moderate' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {stat.status.charAt(0).toUpperCase() + stat.status.slice(1)}
              </p>
            </div>
            <div className="text-4xl ml-6 opacity-90">{stat.icon}</div> {/* Larger icons */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;