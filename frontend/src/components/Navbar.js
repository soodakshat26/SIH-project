// Navbar.js
import React from 'react';
import './Navbar.css';
import {Link} from "react-router-dom";
const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/home">Home</Link>
      <Link to="/recommender">Find a place</Link>
      <Link to="/features">Features</Link>
      <Link to="/about">About</Link>
      <Link to="/testimonials">Testimonials</Link>
      <Link to="/expenses">Expenses</Link>
      <Link to="/feedback">Feedback</Link>
      <Link to="/smartPool">Smart Pool</Link>
      <Link to="/predict">Find Using Image</Link>
    </div>
  );
};

export default Navbar;
