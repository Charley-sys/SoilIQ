import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherWidget = ({ farm }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!farm?.location?.coordinates) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // For now, we'll use mock data since we don't have a weather API set up
        // In production, you would make an actual API call:
        // const response = await axios.get('/api/weather/current', {
        //   params: {
        //     lat: farm.location.coordinates.latitude,
        //     lon: farm.location.coordinates.longitude
        //   }
        // });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data - replace with actual API call
        const mockWeatherData = {
          location: farm?.location?.address || 'Farm Location',
          temperature: 22.5,
          feelsLike: 24.0,
          humidity: 65,
          windSpeed: 3.2,
          windDirection: 180,
          precipitation: 0.0,
          condition: 'Partly Cloudy',
          icon: 'partly-cloudy-day',
          sunrise: '06:45',
          sunset: '18:30',
          forecast: [
            { day: 'Today', high: 24, low: 16, condition: 'Partly Cloudy', icon: 'partly-cloudy-day', precipitation: 10 },
            { day: 'Tomorrow', high: 26, low: 17, condition: 'Sunny', icon: 'clear-day', precipitation: 0 },
            { day: 'Wed', high: 23, low: 15, condition: 'Rain', icon: 'rain', precipitation: 80 }
          ]
        };

        setWeatherData(mockWeatherData);
      } catch (err) {
        console.error('Error fetching weather data:', err);
        setError('Unable to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();

    // Refresh weather data every 30 minutes
    const interval = setInterval(fetchWeatherData, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [farm]);

  const getWeatherIcon = (iconName) => {
    const icons = {
      'clear-day': '☀️',
      'clear-night': '🌙',
      'rain': '🌧️',
      'snow': '❄️',
      'sleet': '🌨️',
      'wind': '💨',
      'fog': '🌫️',
      'cloudy': '☁️',
      'partly-cloudy-day': '⛅',
      'partly-cloudy-night': '☁️',
      'sunny': '☀️'
    };
    return icons[iconName] || '🌤️';
  };

  const getWeatherRecommendation = (weather) => {
    if (!weather) return '';

    const { temperature, precipitation, condition } = weather;

    if (precipitation > 50) {
      return 'Heavy rain expected. Delay irrigation and fertilizer application.';
    }
    
    if (precipitation > 20) {
      return 'Rain expected. Consider reducing irrigation.';
    }

    if (temperature > 30) {
      return 'High temperature. Monitor soil moisture closely.';
    }

    if (temperature < 5) {
      return 'Low temperature. Protect sensitive crops from frost.';
    }

    if (condition.toLowerCase().includes('wind') && weather.windSpeed > 6) {
      return 'Windy conditions. Consider wind protection for young plants.';
    }

    return 'Favorable weather conditions for farming activities.';
  };

  const getPrecipitationColor = (precipitation) => {
    if (precipitation === 0) return 'text-blue-400';
    if (precipitation < 30) return 'text-blue-500';
    if (precipitation < 60) return 'text-blue-600';
    return 'text-blue-700';
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="h3">Weather</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-center py-4">
            <div className="spinner"></div>
            <span className="ml-2 text-gray-600">Loading weather...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="h3">Weather</h3>
        </div>
        <div className="card-body">
          <div className="text-center text-gray-500 py-4">
            <div className="text-2xl mb-2">🌤️</div>
            <p>Weather data unavailable</p>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="card">
        <div className="card-header">
          <h3 className="h3">Weather</h3>
        </div>
        <div className="card-body">
          <div className="text-center text-gray-500 py-4">
            <p>Select a farm to view weather data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="h3">Weather</h3>
        <div className="text-sm text-gray-500">{weatherData.location}</div>
      </div>
      <div className="card-body">
        {/* Current Weather */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl">
              {getWeatherIcon(weatherData.icon)}
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {weatherData.temperature}°C
              </div>
              <div className="text-sm text-gray-600">
                Feels like {weatherData.feelsLike}°C
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">{weatherData.condition}</div>
            <div className="text-xs text-gray-500">
              H: {Math.max(...weatherData.forecast.map(f => f.high))}° • 
              L: {Math.min(...weatherData.forecast.map(f => f.low))}°
            </div>
          </div>
        </div>

        {/* Weather Details */}
        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center gap-2">
            <span>💧</span>
            <span>Humidity: {weatherData.humidity}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💨</span>
            <span>Wind: {weatherData.windSpeed} m/s</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌅</span>
            <span>Sunrise: {weatherData.sunrise}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🌇</span>
            <span>Sunset: {weatherData.sunset}</span>
          </div>
        </div>

        {/* Forecast */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">3-Day Forecast</h4>
          <div className="space-y-2">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-12">{day.day}</span>
                  <span className="text-lg">{getWeatherIcon(day.icon)}</span>
                  <span className="flex-1">{day.condition}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${getPrecipitationColor(day.precipitation)}`}>
                    💧 {day.precipitation}%
                  </span>
                  <span className="w-16 text-right">
                    {day.high}° / {day.low}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Recommendation */}
        <div className="border-t pt-4 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <div>
                <div className="text-sm font-semibold text-blue-900 mb-1">
                  Farming Advice
                </div>
                <div className="text-xs text-blue-800">
                  {getWeatherRecommendation(weatherData)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;