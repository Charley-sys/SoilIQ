import React, { useState, useEffect } from 'react';
import useWebSocket from '../../hooks/usewebsocket';
import { useAuth } from '../../context/AuthContext';
import { useSoilData } from '../../hooks/useSoilData';

const RealTimeDashboard = ({ farmId }) => {
  const { user } = useAuth();
  const { soilData, averages, refreshData } = useSoilData(farmId, '7d');
  const [realTimeData, setRealTimeData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const {
    isConnected,
    lastMessage,
    connectionStatus,
    subscribeToSoilUpdates,
    unsubscribeFromSoilUpdates
  } = useWebSocket();

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (!lastMessage) return;

    const { type, data, timestamp } = lastMessage;

    switch (type) {
      case 'soil_reading_added':
        console.log('New soil reading received:', data);
        setRealTimeData(prev => [data, ...prev.slice(0, 9)]); // Keep last 10 readings
        refreshData(); // Refresh the main data
        
        // Show notification
        addNotification({
          type: 'success',
          title: 'New Soil Reading',
          message: `New reading added for ${data.farm?.name}`,
          timestamp
        });
        break;

      case 'soil_reading_updated':
        console.log('Soil reading updated:', data);
        refreshData();
        break;

      case 'soil_reading_deleted':
        console.log('Soil reading deleted:', data);
        refreshData();
        break;

      case 'health_score_updated':
        console.log('Health score updated:', data);
        refreshData();
        
        addNotification({
          type: 'info',
          title: 'Health Score Updated',
          message: `New health score: ${data.healthScore}`,
          timestamp
        });
        break;

      case 'alert':
        console.log('Alert received:', data);
        addNotification({
          type: 'warning',
          title: data.title || 'Alert',
          message: data.message,
          timestamp,
          persistent: true
        });
        break;

      case 'notification':
        console.log('Notification received:', data);
        addNotification({
          type: 'info',
          title: data.title || 'Notification',
          message: data.message,
          timestamp
        });
        break;

      case 'connection_established':
        console.log('WebSocket connection established');
        if (farmId) {
          subscribeToSoilUpdates(farmId);
        }
        break;

      default:
        console.log('Unknown message type:', type);
    }
  }, [lastMessage, farmId, refreshData, subscribeToSoilUpdates]);

  // Subscribe to soil updates when farm changes
  useEffect(() => {
    if (isConnected && farmId) {
      subscribeToSoilUpdates(farmId);
    }

    return () => {
      if (farmId) {
        unsubscribeFromSoilUpdates(farmId);
      }
    };
  }, [isConnected, farmId, subscribeToSoilUpdates, unsubscribeFromSoilUpdates]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep last 10
    
    // Auto-remove non-persistent notifications after 5 seconds
    if (!notification.persistent) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 5000);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-green-600 bg-green-100';
      case 'connecting': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected': return 'Live';
      case 'connecting': return 'Connecting...';
      case 'error': return 'Connection Error';
      default: return 'Disconnected';
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status Bar */}
      <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConnectionStatusColor()}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-500' :
                connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
              }`}></div>
              {getConnectionStatusText()}
            </div>
          </div>
          
          {connectionStatus === 'connected' && (
            <div className="text-sm text-gray-600">
              Real-time updates active for {farmId ? 'selected farm' : 'all farms'}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>Last update: {new Date().toLocaleTimeString()}</span>
          
          {/* Notifications Badge */}
          {notifications.length > 0 && (
            <div className="relative">
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => document.getElementById('notifications-panel').classList.toggle('hidden')}
              >
                <span className="relative">
                  🔔
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notifications Panel */}
      <div id="notifications-panel" className="hidden">
        <div className="card">
          <div className="card-header">
            <h3 className="h3">Recent Notifications</h3>
          </div>
          <div className="card-body max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <div className="text-2xl mb-2">🔔</div>
                <p>No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.type === 'success' ? 'border-green-200 bg-green-50' :
                      notification.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      notification.type === 'error' ? 'border-red-200 bg-red-50' :
                      'border-blue-200 bg-blue-50'
                    } ${notification.read ? 'opacity-70' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">
                            {notification.title}
                          </span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(notification.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Mark read
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="text-xs text-gray-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="card-footer">
              <button
                onClick={() => setNotifications([])}
                className="btn btn-outline btn-sm"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Real-time Data Stream */}
      {realTimeData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3 className="h3">Real-time Data Stream</h3>
            <div className="text-sm text-gray-500">
              Latest updates from your farms
            </div>
          </div>
          <div className="card-body">
            <div className="space-y-3">
              {realTimeData.map((reading, index) => (
                <div
                  key={reading._id || index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600">🌱</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        New Soil Reading
                      </div>
                      <div className="text-sm text-gray-600">
                        {reading.farm?.name} • pH: {reading.pH} • Moisture: {reading.moisture}%
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(reading.createdAt || reading.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connection Debug Info (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="card">
          <div className="card-header">
            <h3 className="h3">WebSocket Debug</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Status:</span> {connectionStatus}
              </div>
              <div>
                <span className="font-medium">Connected:</span> {isConnected ? 'Yes' : 'No'}
              </div>
              <div>
                <span className="font-medium">Farm ID:</span> {farmId || 'None'}
              </div>
              <div>
                <span className="font-medium">Messages:</span> {realTimeData.length}
              </div>
            </div>
            
            {lastMessage && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <div className="font-medium mb-1">Last Message:</div>
                <pre className="text-xs overflow-x-auto">
                  {JSON.stringify(lastMessage, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeDashboard;