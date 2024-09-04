// Navbar.js
import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <a href="/">Home</a>
      <li><a href="#features">Features</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#testimonials">Testimonials</a></li>
    </div>
  );
};

export default Navbar;
