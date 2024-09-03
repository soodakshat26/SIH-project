// Testimonials.js
import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
  return (
    <div className="testimonials-section">
      <h2>What Our Users Say</h2>
      <div className="testimonial-item">
        <p>"This service made my trip planning so easy! Highly recommend."</p>
        <h4>- User A</h4>
      </div>
      <div className="testimonial-item">
        <p>"Excellent features and great support. Will use again."</p>
        <h4>- User B</h4>
      </div>
    </div>
  );
};

export default Testimonials;
