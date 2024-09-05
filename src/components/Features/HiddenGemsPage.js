// import React, { useState } from 'react';
// import axios from 'axios';
// // import './HiddenGemsPage.css';

// const delhiHiddenGems = [
//   {
//     id: 1,
//     name: 'Agrasen Ki Baoli',
//     description: 'A historical stepwell with a mysterious vibe.',
//     image: 'https://example.com/agrasen-baoli.jpg',
//     url: 'https://example.com/agrasen-baoli-blog',
//   },
//   {
//     id: 2,
//     name: 'Lodhi Art District',
//     description: 'An open-air gallery showcasing street art and murals.',
//     image: 'https://example.com/lodhi-art-district.jpg',
//     url: 'https://www.google.com/maps/place/Lodhi+Art+District/@28.5862489,77.2226361,17z/data=!3m1!4b1!4m6!3m5!1s0x390ce3153812bcf7:0x9d9a5ec4d7038b3e!8m2!3d28.5862489!4d77.225211!16s%2Fg%2F11h07w35ty?entry=ttu&g_ep=EgoyMDI0MDkwMi4xIKXMDSoASAFQAw%3D%3D',
//   },
//   {
//     id: 3,
//     name: 'Hauz Khas Village',
//     description: 'A trendy spot with cafes, art galleries, and historic ruins.',
//     image: 'https://example.com/hauz-khas.jpg',
//     url: 'https://example.com/hauz-khas-blog',
//   },
  
// ];

// const HiddenGemsPage = () => {
//   const [city, setCity] = useState('Delhi'); // For future city-based feature
//   const [gems, setGems] = useState(delhiHiddenGems);

//   return (
//     <div className="hidden-gems-container">
//       <div className="banner">
//         <h1 className="banner-text">HIDDEN GEMS IN {city.toUpperCase()}</h1>
//       </div>

//       <div className="gems-list">
//         {gems.map((gem) => (
//           <div key={gem.id} className="gem-card">
//             <img src={gem.image} alt={gem.name} className="gem-image" />
//             <div className="gem-info">
//               <h2>{gem.name}</h2>
//               <p>{gem.description}</p>
//               <a href={gem.url} target="_blank" rel="noopener noreferrer" className="gem-link">Read More</a>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HiddenGemsPage;


// import React, { useState } from 'react';
// import axios from 'axios';
// import './HiddenGemsPage.css';

// const FOURSQUARE_API_KEY = 'fsq3Wl2CctSE0VJr3uRT1uFDhQhSliP5svs188/2Gb+U9G4='; // Replace with your Foursquare API key
// const FOURSQUARE_BASE_URL = 'https://api.foursquare.com/v3/places/search';

// const HiddenGemsPage = () => {
//   const [location, setLocation] = useState('');
//   const [gems, setGems] = useState([]);

//   const handleLocationChange = (e) => {
//     setLocation(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
      
//       const response = await axios.get(FOURSQUARE_BASE_URL, {
//         headers: {
//           Accept: 'application/json',
//           Authorization: FOURSQUARE_API_KEY, // Add your API key here
//         },
//         params: {
//           query: 'hidden spots', // You can refine this query as per your need
//           near: location, // User's location input
//           categories: '16025,16032', // Category IDs for parks, landmarks, hidden spots
//           limit: 10, // Limit the number of results
//         },
//       });

//       setGems(response.data.results); // Update the state with the response data
//     } catch (error) {
//       console.error('Error fetching data from Foursquare API:', error);
//       setGems([]); // Set to empty array on error
//     }
//   };

//   return (
//     <div className="hidden-gems-container">
//       <h1>Discover Hidden Gems</h1>
//       <form className="location-form" onSubmit={handleSubmit}>
//         <label htmlFor="location">Enter a Location:</label>
//         <input
//           type="text"
//           id="location"
//           value={location}
//           onChange={handleLocationChange}
//           placeholder="Enter a city or place"
//         />
//         <button type="submit">Search</button>
//       </form>

//       {/* Display hidden spots */}
//       <div className="gems-list">
//         {gems.length > 0 ? (
//           gems.map((gem) => (
//             <div key={gem.fsq_id} className="gem-item">
//               <h2>{gem.name}</h2>
//               <p>Category: {gem.categories[0]?.name}</p>
//               <p>Address: {gem.location.formatted_address}</p>
//               <a href={`https://foursquare.com/v/${gem.fsq_id}`} target="_blank" rel="noopener noreferrer">
//                 View on Foursquare
//               </a>
//             </div>
//           ))
//         ) : (
//           <p>No hidden gems found for {location}.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default HiddenGemsPage;

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

