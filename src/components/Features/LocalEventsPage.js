
import React, { useState, useEffect } from 'react';
import './LocalEventsPage.css';
import EventBrite from './Eventbrite'; 

const delhiEvents = {
  music: [
    {
      id: 1,
      name: 'Delhi Music Festival',
      description: 'A festival for music lovers in Delhi.',
      date: '2024-09-10',
      url: 'https://example.com/delhi-music-festival',
    },
    {
      id: 2,
      name: 'Rock Night in Delhi',
      description: 'A rock music event in Delhi.',
      date: '2024-09-15',
      url: 'https://example.com/rock-night-delhi',
    },
  ],
  food: [
    {
      id: 1,
      name: 'Delhi Food Carnival',
      description: 'Enjoy a wide variety of delicious street food.',
      date: '2024-09-20',
      url: 'https://example.com/delhi-food-carnival',
    },
    {
      id: 2,
      name: 'Culinary Workshop',
      description: 'Learn how to cook exotic dishes.',
      date: '2024-09-25',
      url: 'https://example.com/culinary-workshop',
    },
  ],
  
};

const LocaleventsPage = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('music');
  const [events, setEvents] = useState([]);
  const eventbrite = new EventBrite(); 

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.toLowerCase() === 'delhi') {
      
      setEvents(delhiEvents[category] || []);
    } else {
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

        <button type="submit">Find Events</button>
      </form>

      {/* Display the fetched events */}
      <div className="events-list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-item">
              <h2>{event.name?.text || event.name}</h2> {/* Check for Eventbrite API or hardcoded event */}
              <p>{event.description?.text || event.description}</p>
              <p>Date: {event.start?.local ? new Date(event.start.local).toLocaleDateString() : event.date}</p>
              <a href={event.url} target="_blank" rel="noopener noreferrer">More Info</a>
            </div>
          ))
        ) : (
          <p>No events found.</p>
        )}
      </div>
    </div>
  );
};

export default LocaleventsPage;

