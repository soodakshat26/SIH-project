import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate(); // Initialize the hook

  const handleJourneyClick = () => {
    navigate('/recommender'); // Navigate to /recommend
  };

  return (
    <div className="hero-section">
      <div className="overlay"></div>
      <div className="content">
        <h1>Discover Your Next Adventure</h1>
        <p>Explore the world with ease and comfort</p>
        <button className="cta-button" onClick={handleJourneyClick}>
          Start Your Journey
        </button>
      </div>
    </div>
  );
};

export default HeroSection;

