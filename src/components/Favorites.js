import React, { useState, useEffect, useCallback } from "react";

const Favorites = ({ favorites, onAdd, onRemove, fetchFavoriteWeather }) => {
  const [newCity, setNewCity] = useState("");
  const [favoriteWeatherData, setFavoriteWeatherData] = useState({});

  const fetchWeatherForCity = useCallback(
    async (city) => {
      try {
        const data = await fetchFavoriteWeather(city);
        setFavoriteWeatherData((prevData) => ({
          ...prevData,
          [city]: data,
        }));
      } catch (error) {
        console.error(`Failed to fetch weather data for ${city}:`, error);
      }
    },
    [fetchFavoriteWeather]
  );

  useEffect(() => {
    const fetchFavoriteWeatherData = async () => {
      const weatherPromises = favorites.map((fav) => fetchWeatherForCity(fav.city));
      await Promise.all(weatherPromises);
    };
    fetchFavoriteWeatherData();
  }, [favorites, fetchWeatherForCity]);

  const handleAdd = () => {
    if (newCity.trim() === "") {
      alert("Please enter a city name.");
      return;
    }
    onAdd(newCity);
    setNewCity("");
  };

  return (
    <div className="favorites">
      <ul className="favorites-list">
        {favorites.map((fav) => {
          const weather = favoriteWeatherData[fav.city];
          return (
            <li key={fav.id} className="favorite-item">
              <div className="favorite-info">
                <span style={{ fontWeight: "bold" }}>
                  {fav?.city?.toUpperCase()}
                </span>
                {weather ? (
                  weather?.currentWeather && (
                    <div className="weather-summary">
                      <img
                        src={`http://openweathermap.org/img/wn/${weather?.currentWeather?.weather[0]?.icon}@2x.png`}
                        alt={`${weather?.currentWeather?.weather[0]?.description} icon`}
                      />
                      <p>{Math.round(weather?.currentWeather?.main?.temp)}&deg;</p>
                      <p>{weather?.currentWeather?.weather[0]?.description}</p>
                    </div>
                  )
                ) : (
                  <div className="no-weather-data">
                    <i className="material-icons error-icon">error_outline</i>
                    <p>No weather data available for this location.</p>
                    <button
                      className="refresh-button"
                      onClick={() => fetchWeatherForCity(fav.city)}
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => onRemove(fav.id)} className="remove-button">
                Remove
              </button>
            </li>
          );
        })}
      </ul>
      <div className="favorites-input-container">
        <input
          type="text"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          placeholder="Add new favorite city"
          className="favorite-input"
        />
        <button onClick={handleAdd} className="add-button">
          Add
        </button>
      </div>
    </div>
  );
};

export default Favorites;
