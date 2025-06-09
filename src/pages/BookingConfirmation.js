import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./BookingConfirmation.css";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://fullstack-carrental.onrender.com";

const BookingConfirmation = () => {
  const { bookingRef } = useParams(); // bookingRef from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch from your API endpoint by referenceId
        const res = await axios.get(`${API_URL}/api/bookings/${bookingRef}`);
        setBooking(res.data);
      } catch (err) {
        setError("Could not load booking details. Please check your reference or try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingRef]);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate duration in hours
  const calculateDurationInHours = (startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end - start;
    return Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60)));
  };

  const handlePrint = () => window.print();
  const handleReturnHome = () => navigate('/');

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="booking-confirmation-loading">
          <div className="spinner"></div>
          <p>Loading your booking details...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="booking-confirmation-error">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Booking</h2>
          <p>{error}</p>
          <button onClick={handleReturnHome}>Return to Home</button>
        </div>
        <Footer />
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="booking-confirmation-error">
          <div className="error-icon">⚠️</div>
          <h2>Booking Not Found</h2>
          <p>We couldn't find a booking with the provided reference. Please check the reference and try again.</p>
          <button onClick={handleReturnHome}>Return to Home</button>
        </div>
        <Footer />
      </>
    );
  }

  // Use car info (backend or static)
  const car = booking.car || booking.staticCar || {};
  // Robust contact extraction
  const contact = booking.contactDetails || booking.contact_details || {};
  const duration = calculateDurationInHours(booking.startTime, booking.endTime);

  // Calculate price if needed
  const rentalCost = car.price && duration ? car.price * duration : '-';
  const serviceFee = booking.serviceFee || 25;
  const totalCost = booking.totalCost || (Number(rentalCost) + Number(serviceFee));

  return (
    <>
      <Navbar />
      <div className="booking-confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <h1>Booking Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your booking. Your reservation has been successfully confirmed.
          </p>
          
          <div className="confirmation-details">
            <div className="confirmation-ref">
              <h3>Booking Reference</h3>
              <p className="ref-number">{booking.referenceId || "-"}</p>
            </div>
            
            <div className="confirmation-summary">
              <h3>Booking Summary</h3>
              <div className="summary-car">
                <img 
                  src={car.image} 
                  alt={car.name} 
                  className="summary-car-img" 
                  onError={e => e.target.src = "/assets/images/default-car.jpg"}
                />
                <div className="summary-car-info">
                  <h4 className="summary-car-name">{car.name || "-"}</h4>
                  <p className="summary-car-category">{car.category || "-"}</p>
                </div>
              </div>
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Booking Date</span>
                  <span className="summary-value">{formatDate(booking.createdAt)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Customer</span>
                  <span className="summary-value">{contact.fullName || "-"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{contact.email || "-"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Phone</span>
                  <span className="summary-value">{contact.phoneNumber || "-"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pickup Date</span>
                  <span className="summary-value">{formatDate(booking.startTime)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pickup Time</span>
                  <span className="summary-value">{booking.startTime ? new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pickup Location</span>
                  <span className="summary-value">{booking.pickupLocation || "-"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Dropoff Location</span>
                  <span className="summary-value">{booking.dropoffLocation || "-"}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Duration</span>
                  <span className="summary-value">{duration} hours</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Payment Method</span>
                  <span className="summary-value">Credit Card</span>
                </div>
              </div>
              <div className="confirmation-price">
                <div className="price-row">
                  <span>Rental Cost</span>
                  <span>${rentalCost}</span>
                </div>
                <div className="price-row">
                  <span>Service Fee</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="price-row total">
                  <span>Total Paid</span>
                  <span>${totalCost}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="confirmation-actions">
            <button className="print-button" onClick={handlePrint}>
              <i className="fas fa-print"></i> Print Receipt
            </button>
            <button className="home-button" onClick={handleReturnHome}>
              Return to Home
            </button>
          </div>
          <div className="confirmation-footer">
            <p>A confirmation email has been sent to {contact.email || "-"}</p>
            <p>For any queries, please contact our support team.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingConfirmation;