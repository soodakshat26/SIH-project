// FeaturesSection.js
import React from 'react';
import './FeaturesSection.css';
import {Link} from "react-router-dom";
const FeaturesSection = () => {
  return (
    <div className="features-section">
      <h2>Our Features</h2>
      <div className="feature-item">
        <Link to="/weather-alerts"><h3>Weather Alerts</h3></Link>
          <p>Stay updated with real-time weather notifications.</p>
      </div>
      <div className="feature-item">
        <Link to="/local-events"> <h3>Local Events</h3></Link>
        <p>Discover exciting events happening nearby.</p>
        
      </div>

      <div className="feature-item">

        
        <Link to="/local-guide">
          <p>Partner with local guides</p>
        </Link>
        <p></p>

      </div>
      
      <div className="feature-item">

        
        <Link to="/hidden-gems">
          <p>Hidden Gems</p>
        </Link>
        <p>Uncover the Secrets of Your City – Explore Hidden Gems Off the Beaten Path!.</p>

      </div>
      <div className="feature-item">
        <Link to="/expenses"><h3>Expense Splitting</h3></Link>
        <p>Manage and split travel expenses with ease.</p>
      </div>
    </div>
  );
};

export default FeaturesSection;
