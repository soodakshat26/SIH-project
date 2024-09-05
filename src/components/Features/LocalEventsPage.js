
import React, { useState } from 'react';
import axios from 'axios';
import './LocalEventsPage.css';

const FOURSQUARE_API_URL = 'https://api.foursquare.com/v3/places/search'; 
const FOURSQUARE_API_KEY = 'fsq3Wl2CctSE0VJr3uRT1uFDhQhSliP5svs188/2Gb+U9G4='; 


const categoryMapping = {
  music: '10000',  
  food: '13065',   
  sports: '18000', 
  art: '10001',    
  tech: '15000',   
};

const LocaleventsPage = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('music');
  const [events, setEvents] = useState([]);
  
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
      const response = await axios.get(FOURSQUARE_API_URL, {
        headers: {
          Authorization: 'fsq3Wl2CctSE0VJr3uRT1uFDhQhSliP5svs188/2Gb+U9G4=',
        },
        params: {
          near: city,
          categories: categoryMapping[category],
          limit: 7,
        },
      });

     
      console.log(response.data);

      
      if (response.data.results) {
        setEvents(response.data.results);
      } else {
        setEvents([]); 
      }
    } catch (error) {
      console.error('Error fetching events from Foursquare:', error);
      setEvents([]); 
    }
  };

  return (
    <div className="local-events-container">
      <div className="banner">
        <img src="../assets" alt="Local Events" className="banner-image" />
        <h1 className="banner-text">EXPLORE LOCAL EVENTS</h1>
      </div>
      <form className="events-form" onSubmit={handleSubmit}>
        <label htmlFor="city">Enter City Name:</label>
        <input
          type="text"
          id="city"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter your city"
        />

        <label htmlFor="category">Select Category:</label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="music">Music</option>
          <option value="food">Food & Drink</option>
          <option value="sports">Sports</option>
          <option value="art">Art & Culture</option>
          <option value="tech">Tech & Innovation</option>
        </select>

        <button type="submit">Find Local Places</button>
      </form>

     
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.fsq_id} className="event-item">
              <h2>{event.name}</h2>
              <p>{event.location.formatted_address}</p>
              <p>{event.categories && event.categories.length > 0 ? event.categories[0].name : 'No category'}</p>
              <a href={`https://foursquare.com/v/${event.fsq_id}`} target="_blank" rel="noopener noreferrer">More Info</a>
            </div>
          ))
        ) : (
          <p>No events found for the selected city and category.</p>
        )}
      </div>
    </div>
  );
};

export default LocaleventsPage;
