import React from "react";

const WeatherDisplay = ({ data, unit, setUnit }) => {
  const handleToggle = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
  };
  console.log(data);
  return (
    <div className="weather-display">
      <h2>{data.name}</h2>
      <button onClick={handleToggle} className="unit-toggle">
        {unit === "metric" ? "Switch to Fahrenheit" : "Switch to Celsius"}
      </button>
      <div className="weather-details">
        <p>
          Temperature: {data.main.temp}° {unit === "metric" ? "C" : "F"}
        </p>
        <p>Weather: {data.weather[0].description}</p>
        <p>Humidity: {data.main.humidity}%</p>
        <p>Pressure: {data.main.pressure} hPa</p>
        <p>
          Wind: {data.wind.speed} {unit === "metric" ? "m/s" : "mph"}
        </p>
      </div>
    </div>
  );
};

export default WeatherDisplay;
