import React from 'react';

const RecentReadings = ({ readings, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Recent Readings</h2>
      <div className="space-y-3">
        {readings.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No soil readings yet</p>
        ) : (
          readings.map((reading, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-800">
                  {new Date(reading.timestamp).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  {reading.moisture}% moisture • pH {reading.ph}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                reading.moisture > 60 ? 'bg-green-100 text-green-800' : 
                reading.moisture > 40 ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {reading.moisture > 60 ? 'Optimal' : 
                 reading.moisture > 40 ? 'Moderate' : 'Dry'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentReadings;