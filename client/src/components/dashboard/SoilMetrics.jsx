import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SoilMetrics = ({ readings, loading }) => {
  const chartData = readings.map(reading => ({
    date: new Date(reading.timestamp).toLocaleDateString(),
    moisture: reading.moisture,
    ph: reading.ph,
    temperature: reading.temperature,
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Soil Metrics Trend</h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="moisture" 
              stroke="#8884d8" 
              name="Moisture %" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="ph" 
              stroke="#82ca9d" 
              name="pH Level" 
              strokeWidth={2}
            />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ffc658" 
              name="Temperature °C" 
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SoilMetrics;