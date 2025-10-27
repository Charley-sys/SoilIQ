import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Custom hook for weather data management
export const useWeather = (coordinates) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWeatherData = useCallback(async (coords) => {
    if (!coords || !coords.latitude || !coords.longitude) {
      setWeatherData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simulate API call - replace with actual weather API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock weather data - replace with actual API response
      const mockWeather = {
        current: {
          temperature: 22.5,
          feelsLike: 24.0,
          humidity: 65,
          windSpeed: 3.2,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy-day',
          precipitation: 0.0,
          pressure: 1013,
          uvIndex: 4,
          visibility: 10
        },
        daily: [
          { day: 'Mon', high: 24, low: 16, condition: 'Partly Cloudy', precipitation: 10 },
          { day: 'Tue', high: 26, low: 17, condition: 'Sunny', precipitation: 0 },
          { day: 'Wed', high: 23, low: 15, condition: 'Rain', precipitation: 80 },
          { day: 'Thu', high: 21, low: 14, condition: 'Cloudy', precipitation: 30 },
          { day: 'Fri', high: 25, low: 16, condition: 'Sunny', precipitation: 0 }
        ],
        alerts: [
          {
            title: 'Frost Warning',
            description: 'Potential frost overnight. Protect sensitive plants.',
            severity: 'moderate',
            start: '2024-01-15T02:00:00Z',
            end: '2024-01-15T08:00:00Z'
          }
        ]
      };

      setWeatherData(mockWeather);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Get farming recommendations based on weather
  const getFarmingRecommendations = useCallback((weather) => {
    if (!weather) return [];

    const recommendations = [];
    const { current, daily } = weather;

    // Temperature-based recommendations
    if (current.temperature > 30) {
      recommendations.push({
        type: 'warning',
        icon: '🌡️',
        title: 'High Temperature',
        message: 'Consider increasing irrigation frequency to prevent soil drying.'
      });
    }

    if (current.temperature < 5) {
      recommendations.push({
        type: 'warning',
        icon: '❄️',
        title: 'Low Temperature',
        message: 'Protect sensitive crops from potential frost damage.'
      });
    }

    // Precipitation-based recommendations
    const next24hPrecipitation = daily.slice(0, 2).reduce((sum, day) => sum + day.precipitation, 0);
    
    if (next24hPrecipitation > 50) {
      recommendations.push({
        type: 'info',
        icon: '🌧️',
        title: 'Heavy Rain Expected',
        message: 'Delay irrigation and consider drainage management.'
      });
    }

    if (current.precipitation > 0) {
      recommendations.push({
        type: 'info',
        icon: '💧',
        title: 'Rainfall',
        message: 'Natural irrigation occurring. Monitor soil moisture levels.'
      });
    }

    // Wind-based recommendations
    if (current.windSpeed > 6) {
      recommendations.push({
        type: 'warning',
        icon: '💨',
        title: 'Windy Conditions',
        message: 'Consider wind protection for young or delicate plants.'
      });
    }

    // Optimal conditions
    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        icon: '✅',
        title: 'Favorable Conditions',
        message: 'Weather conditions are optimal for most farming activities.'
      });
    }

    return recommendations;
  }, []);

  // Get irrigation advice based on weather and soil moisture
  const getIrrigationAdvice = useCallback((weather, soilMoisture) => {
    if (!weather || soilMoisture == null) return null;

    const { current, daily } = weather;
    const next24hPrecipitation = daily[0]?.precipitation || 0;

    if (next24hPrecipitation > 30) {
      return {
        action: 'delay',
        message: 'Rain expected tomorrow. Delay irrigation to conserve water.',
        confidence: 'high'
      };
    }

    if (soilMoisture < 30 && current.temperature > 25) {
      return {
        action: 'irrigate',
        message: 'Soil is dry and temperatures are high. Recommended to irrigate.',
        confidence: 'high'
      };
    }

    if (soilMoisture > 70) {
      return {
        action: 'hold',
        message: 'Soil moisture is sufficient. No irrigation needed.',
        confidence: 'medium'
      };
    }

    return {
      action: 'monitor',
      message: 'Soil moisture is adequate. Continue monitoring.',
      confidence: 'low'
    };
  }, []);

  // Refresh weather data
  const refreshWeatherData = useCallback(() => {
    if (coordinates) {
      fetchWeatherData(coordinates);
    }
  }, [coordinates, fetchWeatherData]);

  // Fetch weather when coordinates change
  useEffect(() => {
    if (coordinates) {
      fetchWeatherData(coordinates);
    }
  }, [coordinates, fetchWeatherData]);

  // Auto-refresh every 30 minutes
  useEffect(() => {
    if (!coordinates) return;

    const interval = setInterval(() => {
      fetchWeatherData(coordinates);
    }, 30 * 60 * 1000); // 30 minutes

    return () => clearInterval(interval);
  }, [coordinates, fetchWeatherData]);

  return {
    // State
    weatherData,
    loading,
    error,
    
    // Actions
    refreshWeatherData,
    
    // Utilities
    getFarmingRecommendations,
    getIrrigationAdvice,
    
    // Derived data
    hasData: !!weatherData,
    lastUpdated: new Date().toISOString()
  };
};

// Hook for weather alerts
export const useWeatherAlerts = (coordinates) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!coordinates) return;

      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock alerts - replace with actual API
        const mockAlerts = [
          {
            id: 1,
            type: 'frost',
            severity: 'warning',
            title: 'Frost Advisory',
            description: 'Temperatures expected to drop below freezing overnight.',
            startTime: '2024-01-15T02:00:00Z',
            endTime: '2024-01-15T08:00:00Z',
            instructions: 'Protect sensitive crops with covers or move potted plants indoors.'
          },
          {
            id: 2,
            type: 'rain',
            severity: 'info',
            title: 'Heavy Rainfall Expected',
            description: 'Significant rainfall predicted over the next 48 hours.',
            startTime: '2024-01-16T12:00:00Z',
            endTime: '2024-01-18T06:00:00Z',
            instructions: 'Ensure proper drainage and delay fertilizer application.'
          }
        ];

        setAlerts(mockAlerts);
      } catch (error) {
        console.error('Error fetching weather alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [coordinates]);

  return { alerts, loading };
};

export default useWeather;