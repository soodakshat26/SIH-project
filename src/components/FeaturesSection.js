// FeaturesSection.js
import React from 'react';
import './FeaturesSection.css';

const FeaturesSection = () => {
  return (
    <div className="features-section" id="features">
      <h2>Our Features</h2>
      <div className="feature-item">
        <h3>Weather Alerts</h3>
        <p>Stay updated with real-time weather notifications.</p>
      </div>
      <div className="feature-item">

        
        <Link to="/local-events">
          <p>Local Events</p>
        </Link>
        <p>Discover exciting events happening nearby.</p>

      </div>
      <div className="feature-item">

        
        <Link to="/hidden-gems">
          <p>Hidden Gems</p>
        </Link>
        <p>Uncover the Secrets of Your City – Explore Hidden Gems Off the Beaten Path!.</p>

      </div>
      <div className="feature-item">

        
        <Link to="/local-guide">
          <p>Partner with local guides</p>
        </Link>
        <p></p>

      </div>
      <div className="feature-item">
        <h3>Expense Splitting</h3>
        <p>Manage and split travel expenses with ease.</p>
      </div>
    </div>
  );
};

export default FeaturesSection;
