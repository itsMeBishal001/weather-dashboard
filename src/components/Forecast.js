import React from "react";

const Forecast = ({ forecastData, unit }) => {
  if (!forecastData) return null;

  // Group forecasts by date
  const groupedForecasts = forecastData.list.reduce((acc, forecast) => {
    const date = new Date(forecast.dt * 1000)
      .toLocaleDateString()
      .split("/")
      .join("-");
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(forecast);
    return acc;
  }, {});

  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-cards">
        {Object.keys(groupedForecasts).map((date) => (
          <div key={date} className="forecast-card">
            <h3>{date}</h3>
            <div className="forecast-details">
              {groupedForecasts[date].map((forecast, index) => (
                <div key={index} className="forecast-item">
                  <p>
                    <span className="icon">
                      {/* Optional: Add weather icons based on your provider */}
                    </span>
                    <span className="time">
                      {new Date(forecast.dt * 1000).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  <p>
                    <span className="temp">
                      {forecast.main.temp}° {unit === "metric" ? "C " : "F "}
                    </span>
                    <span className="description">
                      {forecast.weather[0].description}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forecast;
