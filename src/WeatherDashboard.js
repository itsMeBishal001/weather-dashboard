import React, { useState, useEffect } from "react";
import Search from "./components/Search";
import WeatherDisplay from "./components/WeatherDisplay";
import Favorites from "./components/Favorites";
import axios from "axios";
import Forecast from "./components/Forecast";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [unit, setUnit] = useState("metric"); // 'metric' for Celsius, 'imperial' for Fahrenheit

  const API_KEY = process.env.REACT_APP_API_KEY;

  const fetchWeatherData = async (city) => {
    try {
      // Fetch coordinates for the city
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: city,
            limit: 1,
            appid: API_KEY,
          },
        }
      );

      if (geoResponse.data.length === 0) {
        alert("City not found");
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      // Fetch current weather data using coordinates
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            units: unit,
            appid: API_KEY,
          },
        }
      );

      setWeatherData(currentWeatherResponse.data);

      // Fetch 5-day forecast data using coordinates
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            lat,
            lon,
            appid: API_KEY,
            units: unit,
          },
        }
      );

      setForecastData(forecastResponse.data);
    } catch (error) {
      console.error("Error fetching weather data", error);
      if (error.response && error.response.status === 401) {
        alert("Invalid API key. Please check your API key and try again.");
      } else {
        alert("Error fetching weather data. Please try again.");
      }
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get("http://localhost:5000/favorites");
      setFavorites(response.data);
    } catch (error) {
      console.error("Error fetching favorites", error);
      alert("Error fetching favorites. Please try again.");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (city) => {
    try {
      const response = await axios.post("http://localhost:5000/favorites", {
        city,
      });
      setFavorites([...favorites, response.data]);
    } catch (error) {
      console.error("Error adding favorite", error);
      alert("Error adding favorite. Please try again.");
    }
  };

  const removeFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/favorites/${id}`);
      setFavorites(favorites.filter((fav) => fav.id !== id));
    } catch (error) {
      console.error("Error removing favorite", error);
      alert("Error removing favorite. Please try again.");
    }
  };

  const fetchFavoriteWeather = async (city) => {
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct`,
        {
          params: {
            q: city,
            limit: 1,
            appid: API_KEY,
          },
        }
      );

      if (geoResponse.data.length === 0) {
        console.error("City not found");
        return;
      }

      const { lat, lon } = geoResponse.data[0];

      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat,
            lon,
            units: unit,
            appid: API_KEY,
          },
        }
      );

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast`,
        {
          params: {
            lat,
            lon,
            units: unit,
            appid: API_KEY,
          },
        }
      );

      return {
        currentWeather: currentWeatherResponse.data,
        forecast: forecastResponse.data,
      };
    } catch (error) {
      console.error("Error fetching weather data for favorite city", error);
      alert("Error fetching weather data. Please try again.");
    }
  };

  return (
    <div className="weatherDashboard">
      <header className="dashboard-header">
        <h1>Weather Dashboard</h1>
        <Search onSearch={fetchWeatherData} />
      </header>
      <main className="dashboard-content">
        {weatherData && (
          <WeatherDisplay data={weatherData} unit={unit} setUnit={setUnit} />
        )}
        {forecastData && <Forecast forecastData={forecastData} unit={unit} />}
      </main>
      <aside className="dashboard-aside">
        <h2>Favorites</h2>
        <Favorites
          favorites={favorites}
          onAdd={addFavorite}
          onRemove={removeFavorite}
          fetchFavoriteWeather={fetchFavoriteWeather}
        />
      </aside>
    </div>
  );
};

export default WeatherDashboard;
