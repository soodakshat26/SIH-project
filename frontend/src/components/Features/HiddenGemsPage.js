

import React, { useState } from 'react';
import axios from 'axios';
import './HiddenGemsPage.css';

const FOURSQUARE_API_KEY = 'fsq3Wl2CctSE0VJr3uRT1uFDhQhSliP5svs188/2Gb+U9G4='; 
const FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v3/places/search';


const DELHI_COORDINATES = { lat: 28.6139, lon: 77.209 };

const HiddenGemsPage = () => {
  const [location, setLocation] = useState('');
  const [gems, setGems] = useState([]);

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    const coordinates = location.toLowerCase() === 'delhi' ? DELHI_COORDINATES : null;

    try {
     
      const response = await axios.get(FOURSQUARE_BASE_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: 'fsq3Wl2CctSE0VJr3uRT1uFDhQhSliP5svs188/2Gb+U9G4=', 
        },
        params: coordinates
          ? {
              ll: `${coordinates.lat},${coordinates.lon}`, 
              categories: '16025,16032,13065,13040',
              limit: 10, 
            }
          : {
              near: location, 
              categories: '16025,16032,13065,13040', 
              limit: 10,
            },
      });

      setGems(response.data.results); 
    } catch (error) {
      console.error('Error fetching data from Foursquare API:', error);
      setGems([]); 
    }
  };

  return (
    <div className="hidden-gems-container">
      <h1>Discover Hidden Spots</h1>
      <form className="location-form" onSubmit={handleSubmit}>
        <label htmlFor="location">Enter a Location:</label>
        <input
          type="text"
          id="location"
          value={location}
          onChange={handleLocationChange}
          placeholder="Enter a city or place"
        />
        <button type="submit">Search</button>
      </form>

      
      <div className="gems-list">
        {gems.length > 0 ? (
          gems.map((gem) => (
            <div key={gem.fsq_id} className="gem-item">
              <h2>{gem.name}</h2>
              <p>Category: {gem.categories[0]?.name}</p>
              <p>Address: {gem.location.formatted_address}</p>
              <a href={`https://foursquare.com/v/${gem.fsq_id}`} target="_blank" rel="noopener noreferrer">
                View on Foursquare
              </a>
            </div>
          ))
        ) : (
          <p>No hidden gems found for {location}.</p>
        )}
      </div>
    </div>
  );
};

export default HiddenGemsPage;

