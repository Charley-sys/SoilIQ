// server/utils/weatherService.js
const axios = require("axios");

async function fetchWeatherData(latitude, longitude) {
  try {
    const res = await axios.get("https://api.open-meteo.com/v1/forecast", {
      params: {
        latitude,
        longitude,
        current: "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
      },
    });

    const current = res.data.current;
    return {
      temperature: current.temperature_2m,
      humidity: current.relative_humidity_2m,
      rainfall: current.precipitation || 0,
      windSpeed: current.wind_speed_10m,
    };
  } catch (err) {
    console.error("Weather API error:", err.message);
    return {
      temperature: 25,   // fallback values if API fails
      humidity: 50,
      rainfall: 0,
      windSpeed: 5,
    };
  }
}

module.exports = fetchWeatherData;
