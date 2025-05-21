import React from "react";
import { FaUser, FaSuitcase, FaCheckCircle } from "react-icons/fa";
import "./CarCard.css";

// Handles both static and backend car objects, with robust fallbacks
const CarCard = ({ car, isSelected, onSelect, hideBookNowButton }) => {
  // Normalize car data fields
  const id = car._id || car.id;
  const name = car.name || car.model || "Car";
  const image = car.image || car.photo || "/assests/images/default-car.jpg";
  const description = car.description || car.details || "";
  const price = car.price || car.rent || 0;
  const passengers = car.passengers || car.capacity || "-";
  const luggage = car.luggage ?? "-";

  // Add image error handling
  const handleImageError = (e) => {
    e.target.src = "/assests/images/default-car.jpg"; // Fallback image
  };

  // Function to handle "Book Now" button click
  const handleBookNowClick = (e) => {
    e.stopPropagation(); // Prevent card click/select if present
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login with redirect back to booknow
      window.location.href = "/login?redirect=/booknow";
    } else {
      localStorage.setItem("selectedCar", JSON.stringify(car));
      window.location.href = "/booknow";
    }
  };

  return (
    <div
      className={`car-card ${isSelected ? "selected" : ""}`}
      onClick={onSelect}
      key={id}
    >
      {isSelected && (
        <div className="selected-tag">
          <FaCheckCircle className="check-icon" /> Selected
        </div>
      )}
      <img
        src={image}
        alt={name}
        className="car-image"
        onError={handleImageError}
      />
      <div className="car-details">
        <h3 className="car-name">{name}</h3>
        <p className="car-description">{description}</p>
        <div className="car-info">
          <span>
            <FaUser className="icon" /> {passengers} Passengers
          </span>
          <span>
            <FaSuitcase className="icon" /> {luggage} Luggage
          </span>
        </div>
        <div className="car-footer">
          <div className="car-price">₹{price}/hour</div>
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