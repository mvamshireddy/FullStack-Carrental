import React from 'react';
import { Link } from 'react-router-dom'; 
import './Hero.css';

const Hero = () => {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Luxury Travel <span className="highlight">Redefined</span>
        </h1>
        <p className="subtitle">
          Experience executive-class transportation with our premium fleet of vehicles and professional drivers. Your journey deserves nothing less than exceptional.
        </p>
        <div className="hero-buttons">
          {/* Button to redirect to booking page */}
          <Link to="/booknow" className="btn-primary">Book Your Ride</Link>
          {/* Button to redirect to Our Vehicles page */}
        <Link to="/vehicles" className="btn-secondary">
          Explore Our Fleet
        </Link>
        </div>
      </div>
      <div className="hero-features">
        <div className="feature">
          <h2>24/7</h2>
          <p>Available Anytime</p>
        </div>
        <div className="feature">
          <h2>100%</h2>
          <p>Customer Satisfaction</p>
        </div>
        <div className="feature">
          <h2>Premium</h2>
          <p>Luxury Fleet</p>
        </div>
      </div>
    </div>
  );
};

export default Hero;