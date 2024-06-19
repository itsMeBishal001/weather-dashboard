import React, { useState } from "react";

const Search = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() === "") {
      alert("Please enter a city name.");
      return;
    }
    onSearch(city);
  };

  return (
    <div className="search">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default Search;
