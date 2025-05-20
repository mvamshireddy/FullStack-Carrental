import React from "react";
import { Link } from 'react-router-dom'; 
import { FaUser, FaSuitcase, FaCheckCircle } from "react-icons/fa";
import "./CarCard.css";

const CarCard = ({ car, isSelected, onSelect, hideBookNowButton }) => {
  // Add image error handling
  const handleImageError = (e) => {
    e.target.src = "/assests/images/default-car.jpg"; // Fallback image
  };

  // Function to handle "Book Now" button click
  const handleBookNowClick = () => {
    // Save car data to localStorage
    localStorage.setItem("selectedCar", JSON.stringify(car));

    // Redirect to BookNow page with "Details" tab active
    window.location.href = "/booknow?activeTab=details";
  };

  return (
    <div
      className={`car-card ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
    >
      {isSelected && (
        <div className="selected-tag">
          <FaCheckCircle className="check-icon" /> Selected
        </div>
      )}
      <img 
        src={car.image} 
        alt={car.name} 
        className="car-image" 
        onError={handleImageError}
      />
      <div className="car-details">
        <h3 className="car-name">{car.name}</h3>
        <p className="car-description">{car.description}</p>
        <div className="car-info">
          <span>
            <FaUser className="icon" /> {car.passengers} Passengers
          </span>
          <span>
            <FaSuitcase className="icon" /> {car.luggage} Luggage
          </span>
        </div>
        <div className="car-footer">
          <div className="car-price">${car.price}/hour</div>
          {/* Conditionally render the "Book Now" button */}
          {!hideBookNowButton && (
            <button onClick={handleBookNowClick} className="book-now-btn">
              Book Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;