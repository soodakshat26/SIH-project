// Testimonials.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Testimonials.css';

const Testimonials = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/feedbacks');
        console.log('Feedbacks fetched:', response.data); // Add console log to debug
        setFeedbacks(response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <div className="testimonials-section">
      <h2>What Our Users Say</h2>
      {feedbacks.length > 0 ? (
        feedbacks.map((feedback, index) => (
          <div className="testimonial-item" key={index}>
            <p>"{feedback.improvements || 'No feedback provided'}"</p>
            <h4>- {feedback.name || 'Anonymous'}</h4>
          </div>
        ))
      ) : (
        <p>No feedback available at the moment.</p>
      )}
    </div>
  );
};

export default Testimonials;


