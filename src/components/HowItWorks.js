import React from "react";
import "./HowItWorks.css";
import { FaCar, FaCalendarAlt, FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";

const HowItWorks = () => {
  return (
    <section className="how-it-works">
      <div className="container">
        <h2>How It Works</h2>
        <p className="subtitle">
          Booking your luxury transportation is simple and straightforward with our easy four-step process.
        </p>
        <div className="steps">
          {/* Step 1 */}
          <div className="step">
            <div className="icon">
              <FaCar />
            </div>
            <h3>Choose Your Vehicle</h3>
            <p>
              Select from our fleet of premium vehicles based on your needs and preferences.
            </p>
          </div>

          {/* Step 2 */}
          <div className="step">
            <div className="icon">
              <FaCalendarAlt />
            </div>
            <h3>Set Your Schedule</h3>
            <p>
              Choose your pickup date, time, location and destination for a seamless experience.
            </p>
          </div>

          {/* Step 3 */}
          <div className="step">
            <div className="icon">
              <FaCreditCard />
            </div>
            <h3>Confirm Booking</h3>
            <p>
              Review your details and confirm your booking with our secure payment system.
            </p>
          </div>

          {/* Step 4 */}
          <div className="step">
            <div className="icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Enjoy Your Ride</h3>
            <p>
              Your professional chauffeur will arrive on time. Sit back, relax and enjoy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;