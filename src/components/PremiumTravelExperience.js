import React from 'react';
import './PremiumTravelExperience.css';
import { FaCalendarAlt, FaPhoneAlt } from 'react-icons/fa';

const PremiumTravelExperience = () => {
  return (
    <div className="premium-travel-container">
      <div className="premium-travel-content">
        <h2 className="premium-travel-heading">Ready for Your Premium Travel Experience?</h2>
        <p className="premium-travel-description">
          Book your luxury transportation today and experience the Shadow Drive difference. 
          Our team is ready to provide you with an unforgettable journey.
        </p>
      </div>
      <div className="premium-travel-actions">
        <button className="book-now-btn">
          <FaCalendarAlt className="icon" /> Book Now
        </button>
        <button className="contact-us-btn">
          <FaPhoneAlt className="icon" /> Contact Us
        </button>
      </div>
    </div>
  );
};

export default PremiumTravelExperience;