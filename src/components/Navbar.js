// Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <a href="/">Home</a>
      <a href="/features">Features</a>
      <a href="/about">About</a>
      <a href="/testimonials">Testimonials</a>
    </div>
  );
};

export default Navbar;
