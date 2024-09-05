import React, { useState } from 'react';
import axios from 'axios';

const HiddenGemsPage = () => {
  const [city, setCity] = useState('');
  const [gems, setGems] = useState([]);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/api/hidden-gems', { city });
      setGems(response.data);
    } catch (error) {
      console.error('Error fetching hidden gems:', error);
    }
  };

  return (
    <div>
      <h1>Hidden Gems</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter city:
          <input type="text" value={city} onChange={handleCityChange} />
        </label>
        <button type="submit">Find Hidden Gems</button>
      </form>
      <div>
        {gems.length > 0 ? (
          <ul>
            {gems.map((gem) => (
              <li key={gem.id}>
                {gem.name} - {gem.address} (Rating: {gem.rating})
              </li>
            ))}
          </ul>
        ) : (
          <p>No hidden gems found.</p>
        )}
      </div>
    </div>
  );
};

export default HiddenGemsPage;
