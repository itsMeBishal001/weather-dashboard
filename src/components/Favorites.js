import React, { useState, useEffect } from "react";

const Favorites = ({
  favorites,
  onAdd,
  onRemove,
  onDisplay,
  fetchFavoriteWeather,
}) => {
  const [newCity, setNewCity] = useState("");

  const [favoriteWeatherData, setFavoriteWeatherData] = useState({});

  useEffect(() => {
    const fetchFavoriteWeatherData = async () => {
      const weatherPromises = favorites.map(async (fav) => {
        const data = await fetchFavoriteWeather(fav.city);
        return { city: fav.city, weather: data }; // Combine city name with weather data
      });
      const weatherData = await Promise.all(weatherPromises); // Wait for all fetches to complete
      setFavoriteWeatherData(
        weatherData.reduce(
          (acc, curr) => ({ ...acc, [curr.city]: curr.weather }),
          {}
        )
      );
    };

    fetchFavoriteWeatherData();
  }, [favorites, fetchFavoriteWeather]);
  const handleAdd = () => {
    if (newCity.trim() === "") {
      alert("Please enter a city name.");
      return;
    }
    onAdd(newCity);
    setNewCity("");
  };

  const handleFavoriteClick = (city) => {
    console.log("clik");
    onDisplay(city); // Call the prop function to display weather for the selected city
  };

  return (
    <div className="favorites">
      <h3>Favorites</h3>
      <ul className="favorites-list">
        {favorites.map((fav) => {
          const weather = favoriteWeatherData[fav.city]; // Get weather data for this city
          return (
            <li key={fav.id} className="favorite-item">
              <div className="favorite-info">
                <span onClick={() => handleFavoriteClick(fav.city)}>
                  {fav.city}
                </span>
                {weather?.current && (
                  <div className="weather-summary">
                    <img
                      src={`http://openweathermap.org/img/wn/${weather?.current?.weather[0]?.icon}@2x.png`}
                      alt={`${weather?.current?.weather[0]?.description} icon`}
                    />
                    <p>{Math.round(weather?.current?.main?.temp)}&deg;</p>
                  </div>
                )}
              </div>
              <button
                onClick={() => onRemove(fav.id)}
                className="remove-button"
              >
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
