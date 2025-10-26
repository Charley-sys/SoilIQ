import React, { useState, useEffect } from 'react';
import { useSoilData } from '../../hooks/useSoilData';

const RealTimeMetrics = ({ farmId }) => {
  const { soilData, averages, loading } = useSoilData(farmId, '7d');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getMetricStatus = (value, parameter) => {
    const ranges = {
      pH: { optimal: [6.0, 7.0], warning: [5.0, 8.0] },
      nitrogen: { optimal: [40, 80], warning: [20, 100] },
      phosphorus: { optimal: [30, 50], warning: [15, 70] },
      potassium: { optimal: [40, 80], warning: [20, 100] },
      moisture: { optimal: [40, 60], warning: [25, 75] },
      organicMatter: { optimal: [3, 5], warning: [2, 6] }
    };

    const range = ranges[parameter];
    if (!range || value == null) return 'unknown';

    if (value >= range.optimal[0] && value <= range.optimal[1]) return 'optimal';
    if (value >= range.warning[0] && value <= range.warning[1]) return 'warning';
    return 'critical';
  };

  const getStatusIcon = (status) => {
    const icons = {
      optimal: '🟢',
      warning: '🟡',
      critical: '🔴',
      unknown: '⚪'
    };
    return icons[status];
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-center py-8">
            <div className="spinner"></div>
            <span className="ml-2 text-gray-600">Loading metrics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!averages) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center py-8 text-gray-500">
            <div className="text-2xl mb-2">📊</div>
            <p>No data available</p>
            <p className="text-sm">Add soil readings to see real-time metrics</p>
          </div>
        </div>
      </div>
    );
  }

  const metrics = [
    { key: 'pH', value: averages.pH, unit: '', label: 'pH Level' },
    { key: 'nitrogen', value: averages.nitrogen, unit: 'ppm', label: 'Nitrogen' },
    { key: 'phosphorus', value: averages.phosphorus, unit: 'ppm', label: 'Phosphorus' },
    { key: 'potassium', value: averages.potassium, unit: 'ppm', label: 'Potassium' },
    { key: 'moisture', value: averages.moisture, unit: '%', label: 'Moisture' },
    { key: 'organicMatter', value: averages.organicMatter, unit: '%', label: 'Organic Matter' }
  ];

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h3 className="h3">Real-time Metrics</h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className={`w-2 h-2 rounded-full bg-green-500 animate-pulse`}></div>
            <span>Live</span>
            <span>•</span>
            <span>Updated {lastUpdate.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
      
      <div className="card-body">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const status = getMetricStatus(metric.value, metric.key);
            
            return (
              <div
                key={metric.key}
                className={`p-4 rounded-lg border-2 ${
                  status === 'optimal' ? 'border-green-200 bg-green-50' :
                  status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                  status === 'critical' ? 'border-red-200 bg-red-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </span>
                  <span className="text-lg">{getStatusIcon(status)}</span>
                </div>
                
                <div className="text-2xl font-bold text-gray-900">
                  {metric.value != null ? metric.value.toFixed(1) : '--'}
                  {metric.unit && <span className="text-sm font-normal ml-1">{metric.unit}</span>}
                </div>
                
                <div className={`text-xs mt-1 ${
                  status === 'optimal' ? 'text-green-600' :
                  status === 'warning' ? 'text-yellow-600' :
                  status === 'critical' ? 'text-red-600' :
                  'text-gray-500'
                }`}>
                  {status === 'optimal' && 'Optimal'}
                  {status === 'warning' && 'Needs Attention'}
                  {status === 'critical' && 'Critical'}
                  {status === 'unknown' && 'No Data'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-600">Based on </span>
              <span className="font-semibold">{soilData.length} readings</span>
              <span className="text-gray-600"> from last 7 days</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span>🟢</span>
                <span className="text-gray-600">Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🟡</span>
                <span className="text-gray-600">Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🔴</span>
                <span className="text-gray-600">Critical</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeMetrics;