// // components/Features/LocalEventsPage.js
// import React from "react";

// const LocalEventsPage = () => {
//   return (
//     <div>
//       <h1>Local Events</h1>
//       <p>Here you can find all the exciting events happening nearby.</p>
//       {/* Add the logic here to fetch and display events using APIs */}
//     </div>
//   );
// };

// export default LocalEventsPage;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./LocalEventsPage.css";

// const LocalEventsPage = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchEvents = async () => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Fetch nearby places that might host events using Google Places API
//         const googleResponse = await axios.get(
//           `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=28.6139&radius=5000&type=event&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`
//         );

//         const places = googleResponse.data.results;

//         // Fetch events from Eventbrite API
//         const eventbriteResponse = await axios.get(
//           `https://www.eventbriteapi.com/v3/events/search/?location.address=New%20Delhi&token=${process.env.REACT_APP_EVENTBRITE_API_KEY}`
//         );

//         const eventbriteEvents = eventbriteResponse.data.events;


//         const combinedEvents = [...places, ...eventbriteEvents];

//         setEvents(combinedEvents);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvents();
//   }, []);

//   return (
//     <div>
//       <h1>Local Events</h1>
//       <p>Here you can find all the exciting events happening nearby.</p>
//       {loading ? (
//         <p>Loading events...</p>
//       ) : error ? (
//         <p>Error loading events: {error}</p>
//       ) : (
//         <ul>
//           {events.map((event, index) => (
//             <li key={index}>
//               {/* Display event details. Adjust the properties according to the actual API responses */}
//               <h3>{event.name || event.title}</h3>
//               <p>{event.vicinity || event.description.text}</p>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default LocalEventsPage;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './LocalEventsPage.css';

// const LocalEventsPage = () => {
//   const [location, setLocation] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [venues, setVenues] = useState([]);

//   // Fetch the user's current location using Google Places API
//   const fetchLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ lat: latitude, lng: longitude });
//       });
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   // Fetch events from Eventbrite API based on location
//   const fetchEvents = async () => {
//     try {
//       if (location) {
//         const response = await axios.get(
//           `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${location.lat}&location.longitude=${location.lng}&expand=venue&token=${process.env.REACT_APP_EVENTBRITE_API_KEY}`
//         );
//         setEvents(response.data.events);
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       if (error.response && error.response.status === 404) {
//         // Handle 404 error specifically
//         console.error('Events not found for the given location.');
//       }
//     }
//   };
//   // Fetch nearby venues from Foursquare API
//   // const fetchVenues = async () => {
//   //   if (location) {
//   //     const response = await axios.get(
//   //       `https://api.foursquare.com/v2/venues/explore?ll=${location.lat},${location.lng}&client_id=${process.env.REACT_APP_FOURSQUARE_CLIENT_ID}&client_secret=${process.env.REACT_APP_FOURSQUARE_CLIENT_SECRET}&v=20230905`
//   //     );
//   //     setVenues(response.data.response.groups[0].items);
//   //   }
//   // };

//   // Fetch nearby venues from Foursquare API v3
// const fetchVenues = async () => {
//   if (location) {
//     try {
//       const response = await axios.get(
//         `https://api.foursquare.com/v3/places/search`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`,
//           },
//           params: {
//             ll: `${location.lat},${location.lng}`,
//             limit: 10, // Example: limit the results to 10 venues
//             radius: 1000, // Example: search within a 1000m radius
//             categories: '13065,13099' // Example: filtering by categories, adjust as needed
//           },
//         }
//       );
//       setVenues(response.data.results);
//     } catch (error) {
//       console.error('Error fetching venues from Foursquare API:', error);
//     }
//   }
// };


//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   useEffect(() => {
//     if (location) {
//       fetchEvents();
//       fetchVenues();
//     }
//   }, [location]);

//   return (
//     <div className="local-events-page">
//       <h2>Local Events</h2>
//       <div className="events-list">
//         {events.length > 0 ? (
//           events.map((event) => (
//             <div key={event.id} className="event-card">
//               <h3>{event.name.text}</h3>
//               <p>{event.description.text}</p>
//               <p><strong>Date:</strong> {new Date(event.start.local).toLocaleString()}</p>
//               <p><strong>Location:</strong> {event.venue.name}, {event.venue.address.localized_address_display}</p>
//               <a href={event.url} target="_blank" rel="noopener noreferrer">More Info & Tickets</a>
//             </div>
//           ))
//         ) : (
//           <p>No events found nearby.</p>
//         )}
//       </div>
//       <h2>Nearby Venues</h2>
//       <div className="venues-list">
//         {venues.length > 0 ? (
//           venues.map((venue) => (
//             <div key={venue.venue.id} className="venue-card">
//               <h3>{venue.venue.name}</h3>
//               <p>{venue.venue.location.address}</p>
//               <p>{venue.venue.categories[0].name}</p>
//               <a href={`https://foursquare.com/v/${venue.venue.id}`} target="_blank" rel="noopener noreferrer">More Info</a>
//             </div>
//           ))
//         ) : (
//           <p>No venues found nearby.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LocalEventsPage;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './LocalEventsPage.css';

// const LocalEventsPage = () => {
//   const [location, setLocation] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [venues, setVenues] = useState([]);
//   const [selectedVenue, setSelectedVenue] = useState(null);
//   const setNewDelhiLocation = () => {
//     setLocation({ lat: 28.6139, lng: 77.2090 }); // Latitude and Longitude for New Delhi
// };


//   const fetchLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ lat: latitude, lng: longitude });
//       });
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };


//   // Fetch events from Eventbrite API based on location
//   const fetchEvents = async () => {
//     try {
//       if (location) {
//         const response = await axios.get(
//           `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${location.lat}&location.longitude=${location.lng}&expand=venue&token=${process.env.REACT_APP_EVENTBRITE_API_KEY}`
//         );
//         setEvents(response.data.events);
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//       if (error.response && error.response.status === 404) {
//         console.error('Events not found for the given location.');
//       }
//     }
//   };

//   // Fetch nearby venues from Foursquare API v3
//   const fetchVenues = async () => {
//     if (location) {
//       try {
//         const response = await axios.get(
//           `https://api.foursquare.com/v3/places/search`,
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`,
//             },
//             params: {
//               ll: `${location.lat},${location.lng}`,
//               limit: 10,
//               radius: 1000,
//               categories: '13065,13099',
//             },
//           }
//         );
//         setVenues(response.data.results);
//       } catch (error) {
//         console.error('Error fetching venues from Foursquare API:', error);
//       }
//     }
//   };

//   // Fetch details for a specific venue
//   const fetchVenueDetails = async (venueId) => {
//     try {
//       const response = await axios.get(
//         `https://api.foursquare.com/v3/places/${venueId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`,
//           },
//         }
//       );
//       setSelectedVenue(response.data);
//     } catch (error) {
//       console.error('Error fetching venue details:', error);
//     }
//   };
//   useEffect(() => {
//     fetchLocation(); // Uncomment this line if you want to use real geolocation
//     // setNewDelhiLocation(); // Comment this line if you want to use real geolocation
//   }, []);



//   useEffect(() => {
//     if (location) {
//       fetchEvents();
//       fetchVenues();
//     }
//   }, [location]);

//   return (
//     <div className="local-events-page">
//       <h2>Local Events</h2>
//       <div className="events-list">
//         {events.length > 0 ? (
//           events.map((event) => (
//             <div key={event.id} className="event-card">
//               <h3>{event.name.text}</h3>
//               <p>{event.description.text}</p>
//               <p><strong>Date:</strong> {new Date(event.start.local).toLocaleString()}</p>
//               <p><strong>Location:</strong> {event.venue.name}, {event.venue.address.localized_address_display}</p>
//               <a href={event.url} target="_blank" rel="noopener noreferrer">More Info & Tickets</a>
//             </div>
//           ))
//         ) : (
//           <p>No events found nearby.</p>
//         )}
//       </div>
//       <h2>Nearby Venues</h2>
//       <div className="venues-list">
//         {venues.length > 0 ? (
//           venues.map((venue) => (
//             <div key={venue.fsq_id} className="venue-card" onClick={() => fetchVenueDetails(venue.fsq_id)}>
//               <h3>{venue.name}</h3>
//               <p>{venue.location.address}</p>
//               <p>{venue.categories[0].name}</p>
//               <a href={`https://foursquare.com/v/${venue.fsq_id}`} target="_blank" rel="noopener noreferrer">More Info</a>
//             </div>
//           ))
//         ) : (
//           <p>No venues found nearby.</p>
//         )}
//       </div>
//       {selectedVenue && (
//         <div className="venue-details">
//           <h2>Venue Details</h2>
//           <h3>{selectedVenue.name}</h3>
//           <p><strong>Address:</strong> {selectedVenue.location.formatted_address}</p>
//           <p><strong>Categories:</strong> {selectedVenue.categories.map(cat => cat.name).join(', ')}</p>
//           <p><strong>Rating:</strong> {selectedVenue.rating}</p>
//           <p><strong>Phone:</strong> {selectedVenue.contact ? selectedVenue.contact.formattedPhone : 'N/A'}</p>
//           <a href={`https://foursquare.com/v/${selectedVenue.id}`} target="_blank" rel="noopener noreferrer">More Info</a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocalEventsPage;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import './LocalEventsPage.css';

// const LocalEventsPage = () => {
//   const [location, setLocation] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [venues, setVenues] = useState([]);
//   const [selectedVenue, setSelectedVenue] = useState(null);

//   // Fetch the user's current location
//   const fetchLocation = async () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         setLocation({ lat: latitude, lng: longitude });
//       });
//     } else {
//       console.error('Geolocation is not supported by this browser.');
//     }
//   };

//   // Fetch events from Eventbrite API based on location
//   const fetchEvents = async () => {
//     try {
//       if (location) {
//         const response = await axios.get(
//           `https://www.eventbriteapi.com/v3/events/search/`,
//           {
//             params: {
//               'location.latitude': location.lat,
//               'location.longitude': location.lng,
//               'expand': 'venue',
//               'token': process.env.REACT_APP_EVENTBRITE_API_KEY
//             }
//           }
//         );
//         console.log('Eventbrite response:', response.data);
//         setEvents(response.data.events);
//       }
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   // Fetch nearby venues from Foursquare API 
//   const fetchVenues = async () => {
//     if (location) {
//       try {
//         const response = await axios.get(
//           `https://api.foursquare.com/v3/places/search`,
//           {
//             headers: {
//               Authorization: `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`,
//             },
//             params: {
//               ll: `${location.lat},${location.lng}`,
//               limit: 10,
//               radius: 1000,
//               categories: '13065,13099',
//             },
//           }
//         );
//         console.log('Foursquare response:', response.data);
//         setVenues(response.data.results);
//       } catch (error) {
//         console.error('Error fetching venues from Foursquare API:', error);
//       }
//     }
//   };

//   // Fetch details for a specific venue
//   const fetchVenueDetails = async (venueId) => {
//     try {
//       const response = await axios.get(
//         `https://api.foursquare.com/v3/places/${venueId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`,
//           },
//         }
//       );
//       setSelectedVenue(response.data);
//     } catch (error) {
//       console.error('Error fetching venue details:', error);
//     }
//   };

//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   useEffect(() => {
//     if (location) {
//       fetchEvents();
//       fetchVenues();
//     }
//   }, [location]);

//   return (
//     <div className="local-events-page">
//       <h2>Local Events</h2>
//       <div className="events-list">
//         {events.length > 0 ? (
//           events.map((event) => (
//             <div key={event.id} className="event-card">
//               <h3>{event.name.text}</h3>
//               <p>{event.description.text}</p>
//               <p><strong>Date:</strong> {new Date(event.start.local).toLocaleString()}</p>
//               <p><strong>Location:</strong> {event.venue.name}, {event.venue.address.localized_address_display}</p>
//               <a href={event.url} target="_blank" rel="noopener noreferrer">More Info & Tickets</a>
//             </div>
//           ))
//         ) : (
//           <p>No events found nearby.</p>
//         )}
//       </div>
//       <h2>Nearby Venues</h2>
//       <div className="venues-list">
//         {venues.length > 0 ? (
//           venues.map((venue) => (
//             <div key={venue.fsq_id} className="venue-card" onClick={() => fetchVenueDetails(venue.fsq_id)}>
//               <h3>{venue.name}</h3>
//               <p>{venue.location.address}</p>
//               <p>{venue.categories[0].name}</p>
//               <a href={`https://foursquare.com/v/${venue.fsq_id}`} target="_blank" rel="noopener noreferrer">More Info</a>
//             </div>
//           ))
//         ) : (
//           <p>No venues found nearby.</p>
//         )}
//       </div>
//       {selectedVenue && (
//         <div className="venue-details">
//           <h2>Venue Details</h2>
//           <h3>{selectedVenue.name}</h3>
//           <p><strong>Address:</strong> {selectedVenue.location.formatted_address}</p>
//           <p><strong>Categories:</strong> {selectedVenue.categories.map(cat => cat.name).join(', ')}</p>
//           <p><strong>Rating:</strong> {selectedVenue.rating}</p>
//           <p><strong>Phone:</strong> {selectedVenue.contact ? selectedVenue.contact.formattedPhone : 'N/A'}</p>
//           <a href={`https://foursquare.com/v/${selectedVenue.id}`} target="_blank" rel="noopener noreferrer">More Info</a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LocalEventsPage;

// src/components/LocalEventsPage.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const LocalEventsPage = () => {
//   const [location, setLocation] = useState('');
//   const [events, setEvents] = useState([]);

//   const handleLocationChange = (event) => {
//     setLocation(event.target.value);
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await axios.post('/api/events', { location });
//       setEvents(response.data);
//     } catch (error) {
//       console.error('Error fetching events:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>Local Events</h1>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Enter your location:
//           <input type="text" value={location} onChange={handleLocationChange} />
//         </label>
//         <button type="submit">Find Events</button>
//       </form>
//       <div>
//         {events.length > 0 ? (
//           <ul>
//             {events.map((event) => (
//               <li key={event.id}>{event.name} - {event.date}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No events found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LocalEventsPage;



// import React, { useState } from 'react';
// import './LocalEventsPage.css';

// const LocaleventsPage = () => {
//   const [city, setCity] = useState('');
//   const [category, setCategory] = useState('music');

//   const handleCityChange = (e) => {
//     setCity(e.target.value);
//   };

//   const handleCategoryChange = (e) => {
//     setCategory(e.target.value);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add API call logic here to fetch events based on city and category
//     console.log(`Fetching events in ${city} for ${category} category`);
//   };

//   return (
//     <div className="local-events-container">
//       <div className="banner">
//         <img src="../assets" alt="Local Events" className="banner-image" />
//         <h1 className="banner-text">EXPLORE LOCAL EVENTS</h1>
//       </div>
//       <form className="events-form" onSubmit={handleSubmit}>
//         <label htmlFor="city">Enter City Name:</label>
//         <input
//           type="text"
//           id="city"
//           value={city}
//           onChange={handleCityChange}
//           placeholder="Enter your city"
//         />

//         <label htmlFor="category">Select Category:</label>
//         <select id="category" value={category} onChange={handleCategoryChange}>
//           <option value="music">Music</option>
//           <option value="food">Food & Drink</option>
//           <option value="sports">Sports</option>
//           <option value="art">Art & Culture</option>
//           <option value="tech">Tech & Innovation</option>
//         </select>

//         <button type="submit">Find Events</button>
//       </form>
//     </div>
//   );
// };

// export default LocaleventsPage;


import React, { useState, useEffect } from 'react';
import './LocalEventsPage.css';
import EventBrite from './Eventbrite'; // Import the EventBrite class

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
  // You can add more categories like sports, art, etc.
};

const LocaleventsPage = () => {
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('music');
  const [events, setEvents] = useState([]);
  const eventbrite = new EventBrite(); // Instantiate the EventBrite class

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     // Call the EventBrite API using the queryAPI method
  //     const response = await eventbrite.queryAPI(city, category);
  //     setEvents(response.events.events); // Set the events in state
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await eventbrite.queryAPI(city, category);
  //     // Check if response and response.events are defined before setting the state
  //     if (response && response.events && response.events.events) {
  //       setEvents(response.events.events);
  //     } else {
  //       console.error('Invalid response structure:', response);
  //       setEvents([]); // Set empty events if the structure is invalid
  //     }
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //     setEvents([]); // Ensure events is cleared if there's an error
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await eventbrite.queryAPI(city, category);
  //     // Ensure the response contains the expected structure and city filtering
  //     if (response && response.events && response.events.events) {
  //       const filteredEvents = response.events.events.filter(
  //         (event) => event.venue && event.venue.address.city.toLowerCase() === 'delhi'
  //       );
  //       setEvents(delhiEvents);
  //     } else {
  //       setEvents([]);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching events:', error);
  //     setEvents([]);
  //   }
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.toLowerCase() === 'delhi') {
      // Get events for Delhi based on the selected category
      setEvents(delhiEvents[category] || []);
    } else {
      setEvents([]); // If city is not Delhi, display no events
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

