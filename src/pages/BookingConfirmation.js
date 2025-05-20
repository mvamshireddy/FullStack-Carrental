import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./BookingConfirmation.css";
import axios from 'axios';

const BookingConfirmation = () => {
  const { bookingRef } = useParams(); // Get booking reference from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    // Fetch booking details from API using the reference
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would replace this with your actual API endpoint
        // Example: const response = await axios.get(`http://localhost:5000/api/bookings/reference/${bookingRef}`);
        
        // For now, we'll use a mock booking from localStorage if available
        const storedBooking = localStorage.getItem("confirmedBooking");
        
        if (storedBooking) {
          setBookingData(JSON.parse(storedBooking));
          setLoading(false);
        } else {
          // Simulate API response
          // Replace this with actual API call when backend is ready
          setTimeout(() => {
            // Mock data for demonstration
            setBookingData({
              bookingRef: bookingRef || "REF-123456",
              car: JSON.parse(localStorage.getItem("selectedCar")) || {
                name: "Sample Car",
                category: "Luxury",
                image: "/assets/images/car1.jpg",
                price: 120,
                passengers: 4
              },
              bookingDetails: JSON.parse(localStorage.getItem("bookingDetails")) || {
                pickupStartDate: "2025-05-20",
                pickupStartTime: "10:00",
                dropoffEndDate: "2025-05-21",
                dropoffEndTime: "10:00",
                pickupLocation: "Airport Terminal 1",
                dropoffLocation: "City Center"
              },
              contactDetails: JSON.parse(localStorage.getItem("contactDetails")) || {
                fullName: "John Doe",
                email: "john@example.com",
                phoneNumber: "1234567890",
                specialRequests: ""
              },
              paymentMethod: localStorage.getItem("paymentMethod") || "creditCard",
              totalCost: localStorage.getItem("totalCost") || 250,
              serviceFee: 25,
              bookingDate: getCurrentDate()
            });
            setLoading(false);
          }, 1000);
        }
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError("Could not load booking details. Please try again.");
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingRef]);

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Function to get current date for booking confirmation
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate duration in hours between two dates/times
  const calculateDurationInHours = (startDate, startTime, endDate, endTime) => {
    if (!startDate || !endDate) return 0;

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    const diffInMs = end - start;
    return Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60))); // Minimum 1 hour
  };

  // Handle print functionality
  const handlePrint = () => {
    window.print();
  };

  // Return to home page
  const handleReturnHome = () => {
    navigate('/');
  };

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

  if (!bookingData) {
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

  // Calculate duration if we have the booking details
  const duration = bookingData.bookingDetails ? 
    calculateDurationInHours(
      bookingData.bookingDetails.pickupStartDate,
      bookingData.bookingDetails.pickupStartTime,
      bookingData.bookingDetails.dropoffEndDate,
      bookingData.bookingDetails.dropoffEndTime
    ) : 0;

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
              <p className="ref-number">{bookingData.bookingRef}</p>
            </div>
            
            <div className="confirmation-summary">
              <div className="booking summary h">
              <h3>Booking Summary</h3>
              </div>
              
              <div className="summary-car">
                <img 
                  src={bookingData.car.image} 
                  alt={bookingData.car.name} 
                  className="summary-car-img" 
                  onError={(e) => e.target.src = "/assets/images/default-car.jpg"} 
                />
                <div className="summary-car-info">
                  <h4 className="summary-car-name">{bookingData.car.name}</h4>
                  <p className="summary-car-category">{bookingData.car.category}</p>
                </div>
              </div>
              
              <div className="summary-grid">
                <div className="summary-item">
                  <span className="summary-label">Booking Date</span>
                  <span className="summary-value">{bookingData.bookingDate || getCurrentDate()}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Customer</span>
                  <span className="summary-value">{bookingData.contactDetails.fullName}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Email</span>
                  <span className="summary-value">{bookingData.contactDetails.email}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Phone</span>
                  <span className="summary-value">{bookingData.contactDetails.phoneNumber}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pickup Date</span>
                  <span className="summary-value">{formatDate(bookingData.bookingDetails.pickupStartDate)}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pickup Time</span>
                  <span className="summary-value">{bookingData.bookingDetails.pickupStartTime}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Pickup Location</span>
                  <span className="summary-value">{bookingData.bookingDetails.pickupLocation}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Dropoff Location</span>
                  <span className="summary-value">{bookingData.bookingDetails.dropoffLocation}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Duration</span>
                  <span className="summary-value">{duration} hours</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Payment Method</span>
                  <span className="summary-value">
                    {bookingData.paymentMethod === "creditCard" ? "Credit Card" : 
                     bookingData.paymentMethod === "upi" ? "UPI" : "Bank Transfer"}
                  </span>
                </div>
              </div>
              
              <div className="confirmation-price">
                <div className="price-row">
                  <span>Rental Cost</span>
                  <span>${bookingData.totalCost - bookingData.serviceFee}</span>
                </div>
                <div className="price-row">
                  <span>Service Fee</span>
                  <span>${bookingData.serviceFee}</span>
                </div>
                <div className="price-row total">
                  <span>Total Paid</span>
                  <span>${bookingData.totalCost}</span>
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
            <p>A confirmation email has been sent to {bookingData.contactDetails.email}</p>
            <p>For any queries, please contact our support team.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookingConfirmation;