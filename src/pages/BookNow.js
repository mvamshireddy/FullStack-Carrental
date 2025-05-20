import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";
import "./BookNow.css";
import { allCars } from '../data/cars';

const SERVICE_FEE = 25; // Fixed service fee

const BookNow = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [activeTab, setActiveTab] = useState("vehicle");
  const [selectedCar, setSelectedCar] = useState(null); // Track selected car
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard"); // Default to Credit Card
  const [cardNumber, setCardNumber] = useState(""); // Track card number input
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false); // Track if booking is confirmed
  const [bookingRef, setBookingRef] = useState(""); // Store booking reference number
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state

  // Pre-fill selectedCar from localStorage on load
  useEffect(() => {
    const storedCar = localStorage.getItem("selectedCar");
    if (storedCar) {
      setSelectedCar(JSON.parse(storedCar));
      setActiveTab("details"); // Redirect to "Details" tab if car is pre-selected
      localStorage.removeItem("selectedCar"); // Clear after use
    }
  }, []);
  
  // Function to handle card number validation and formatting
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 16) value = value.slice(0, 16); // Limit to 16 digits
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 "); // Add space every 4 digits
    setCardNumber(formattedValue);
  };

  // Function to handle Expiry Date input validation and formatting
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 4) value = value.slice(0, 4); // Limit to 4 digits

    // Add "/" after the first two digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }

    e.target.value = value; // Update the input field value
  };

  // Function to handle CVV input validation
  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 3) value = value.slice(0, 3); // Limit to 3 digits

    e.target.value = value; // Update the input field value
  };

  // Function to generate random booking reference
  const generateBookingRef = () => {
    // Create a more sophisticated reference including timestamp
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 8);
    const random = Math.floor(100000 + Math.random() * 900000); // Random 6-digit
    return `REF-${timestamp}-${random}`;
  };

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

  // Function to handle printing
  const handlePrint = () => {
    window.print();
  };

  // Function to handle booking confirmation
  const handleConfirmBooking = async () => {
    // Prevent multiple form submissions
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Payment method validation
      if (selectedPaymentMethod === "creditCard" && !cardNumber) {
        alert("Please complete the credit card details before confirming the booking.");
        setIsSubmitting(false);
        return;
      }

      if (selectedPaymentMethod === "upi" && !document.querySelector('input[placeholder="example@upi"]').value) {
        alert("Please enter your UPI ID before confirming the booking.");
        setIsSubmitting(false);
        return;
      }

      if (selectedPaymentMethod === "bankTransfer" && 
          (!document.querySelector('input[placeholder="Enter your bank account number"]').value || 
          !document.querySelector('input[placeholder="Enter IFSC code"]').value)) {
        alert("Please complete the bank transfer details before confirming the booking.");
        setIsSubmitting(false);
        return;
      }

      // Generate booking reference
      const ref = generateBookingRef();
      setBookingRef(ref);

      // Create booking data object
      const bookingData = {
        bookingRef: ref,
        car: selectedCar,
        bookingDetails: bookingDetails,
        contactDetails: contactDetails,
        paymentMethod: selectedPaymentMethod,
        totalCost: calculateTotalCost(),
        serviceFee: SERVICE_FEE,
        bookingDate: getCurrentDate(),
        timestamp: new Date().toISOString() // Add exact timestamp for sorting/filtering
      };

      // If backend API is ready, you would send data to the backend here
      // For now, save to localStorage
      localStorage.setItem("confirmedBooking", JSON.stringify(bookingData));

      // Mark booking as confirmed (for current page state)
      setIsBookingConfirmed(true);
      
      // Option 1: Show confirmation tab in current page
      //setActiveTab("confirmed");
      
      // Option 2: Navigate to dedicated confirmation page after a short delay
      // This delay allows the user to see the "processing" state
      setTimeout(() => {
        navigate(`/confirmation/${ref}`);
      }, 1500);

      // In a real implementation, you would also handle error cases
      // and provide appropriate feedback to the user
    } catch (error) {
      console.error("Error processing booking:", error);
      alert("There was an error processing your booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [bookingDetails, setBookingDetails] = useState({
    pickupStartDate: "",
    pickupStartTime: "",
    dropoffEndDate: "",
    dropoffEndTime: "",
    pickupLocation: "",
    dropoffLocation: "",
  });

  const [contactDetails, setContactDetails] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    specialRequests: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
  });

  const allVehicles = allCars; // Assuming allCars is an array of car objects

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCarSelection = (car) => {
    setSelectedCar(car); // Update selected car
  };

  const handleBookingDetailsChange = (field, value) => {
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleContactDetailsChange = (field, value) => {
    setContactDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: emailRegex.test(value) ? "" : "Invalid email format.",
      }));
    }

    if (field === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber: phoneRegex.test(value) ? "" : "Phone number must be 10 digits.",
      }));
    }
  };

  const calculateDurationInHours = () => {
    if (!bookingDetails.pickupStartDate || !bookingDetails.dropoffEndDate) return 0;

    const start = new Date(`${bookingDetails.pickupStartDate}T${bookingDetails.pickupStartTime}`);
    const end = new Date(`${bookingDetails.dropoffEndDate}T${bookingDetails.dropoffEndTime}`);

    const diffInMs = end - start;
    return Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60))); // Minimum 1 hour
  };

  const calculateRentalCost = () => {
    const duration = calculateDurationInHours();
    return selectedCar ? selectedCar.price * duration : 0;
  };

  const calculateTotalCost = () => {
    return calculateRentalCost() + SERVICE_FEE;
  };

  const isDetailsPageComplete = () => {
    return (
      bookingDetails.pickupStartDate &&
      bookingDetails.pickupStartTime &&
      bookingDetails.dropoffEndDate &&
      bookingDetails.dropoffEndTime &&
      bookingDetails.pickupLocation &&
      bookingDetails.dropoffLocation
    );
  };

  const isContactPageComplete = () => {
    return (
      contactDetails.fullName &&
      contactDetails.email &&
      contactDetails.phoneNumber &&
      !errors.email &&
      !errors.phoneNumber
    );
  };

  return (
    <>
      <Navbar />
      <div className="book-now-page">
        <header className="book-now-header">
          <h1>Book Your Ride</h1>
          <p>Complete the booking process below to secure your luxury transportation.</p>
        </header>

        {activeTab !== "confirmed" && (
          <div className="book-now-tabs">
            <button
              className={`tab ${activeTab === "vehicle" ? "active" : ""}`}
              onClick={() => handleTabClick("vehicle")}
              disabled={isBookingConfirmed}
            >
              Vehicle
            </button>
            <button
              className={`tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => handleTabClick("details")}
              disabled={!selectedCar || isBookingConfirmed}
            >
              Details
            </button>
            <button
              className={`tab ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => handleTabClick("contact")}
              disabled={!isDetailsPageComplete() || isBookingConfirmed}
            >
              Contact
            </button>
            <button
              className={`tab ${activeTab === "payment" ? "active" : ""}`}
              onClick={() => handleTabClick("payment")}
              disabled={!isContactPageComplete() || isBookingConfirmed}
            >
              Payment
            </button>
            {isBookingConfirmed && (
              <button
                className={`tab ${activeTab === "confirmed" ? "active" : ""}`}
                onClick={() => handleTabClick("confirmed")}
              >
                Confirmed
              </button>
            )}
          </div>
        )}

        <div className="book-now-content">
          {/* Vehicle Selection Page */}
          {activeTab === "vehicle" && (
            <div className="vehicle-selection">
              <h2>Select Your Vehicle</h2>
              <p className="subtitle">Choose the luxury vehicle that best suits your needs</p>
              <div className="vehicles-container">
                <div className="vehicles-list">
                  {allVehicles.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      isSelected={selectedCar?.id === car.id}
                      onSelect={() => handleCarSelection(car)}
                      hideBookNowButton={true} // Hide the button on the Vehicle Page
                    />
                  ))}
                </div>
              </div>
              <div className="action-buttons">
                <button className="cancel-button" onClick={() => navigate("/")}>Cancel</button>
                <button
                  className="continue-button"
                  disabled={!selectedCar}
                  onClick={() => setActiveTab("details")}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Booking Details Page */}
          {activeTab === "details" && (
            <div className="booking-details">
              <h2>Booking Details</h2>
              <form className="details-form">
                <label>
                  Pickup/Start Date
                  <input
                    type="date"
                    value={bookingDetails.pickupStartDate}
                    onClick={(e) => e.target.showPicker()} // Trigger picker on click
                    onChange={(e) => handleBookingDetailsChange("pickupStartDate", e.target.value)}
                  />
                </label>
                <label>
                  Pickup/Start Time
                  <input
                    type="time"
                    value={bookingDetails.pickupStartTime}
                    onClick={(e) => e.target.showPicker()} // Trigger picker on click
                    onChange={(e) => handleBookingDetailsChange("pickupStartTime", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off/End Date
                  <input
                    type="date"
                    value={bookingDetails.dropoffEndDate}
                    onClick={(e) => e.target.showPicker()} // Trigger picker on click
                    onChange={(e) => handleBookingDetailsChange("dropoffEndDate", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off/End Time
                  <input
                    type="time"
                    value={bookingDetails.dropoffEndTime}
                    onClick={(e) => e.target.showPicker()} // Trigger picker on clickss
                    onChange={(e) => handleBookingDetailsChange("dropoffEndTime", e.target.value)}
                  />
                </label>
                <label>
                  Pickup Location
                  <input
                    type="text"
                    value={bookingDetails.pickupLocation}
                    onChange={(e) => handleBookingDetailsChange("pickupLocation", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off Location
                  <input
                    type="text"
                    value={bookingDetails.dropoffLocation}
                    onChange={(e) => handleBookingDetailsChange("dropoffLocation", e.target.value)}
                  />
                </label>
              </form>
              <div className="action-buttons">
                <button className="cancel-button" onClick={() => setActiveTab("vehicle")}>
                  Back
                </button>
                <button
                  className="continue-button"
                  disabled={!isDetailsPageComplete()}
                  onClick={() => setActiveTab("contact")}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Contact Information Page */}
          {activeTab === "contact" && (
            <div className="contact-details">
              <h2>Contact Information</h2>
              <form className="details-form">
                <label>
                  Full Name
                  <input
                    type="text"
                    value={contactDetails.fullName}
                    onChange={(e) => handleContactDetailsChange("fullName", e.target.value)}
                  />
                </label>
                <label>
                  Email Address
                  <input
                    type="email"
                    value={contactDetails.email}
                    onChange={(e) => handleContactDetailsChange("email", e.target.value)}
                  />
                  {errors.email && <p className="error">{errors.email}</p>}
                </label>
                <label>
                  Phone Number
                  <input
                    type="tel"
                    value={contactDetails.phoneNumber}
                    onChange={(e) => handleContactDetailsChange("phoneNumber", e.target.value)}
                    placeholder="Enter your phone number"
                  />
                  {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
                </label>
                <label>
                  Special Requests (Optional)
                  <textarea
                    value={contactDetails.specialRequests}
                    onChange={(e) => handleContactDetailsChange("specialRequests", e.target.value)}
                  />
                </label>
              </form>
              <div className="action-buttons">
                <button className="cancel-button" onClick={() => setActiveTab("details")}>
                  Back
                </button>
                <button
                  className="continue-button"
                  disabled={!isContactPageComplete()}
                  onClick={() => setActiveTab("payment")}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Payment Page */}
          {activeTab === "payment" && selectedCar && (
            <div className="payment-details">
              <h2>Payment & Confirmation</h2>

              {/* Booking Summary Section */}
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-car">
                  <img src={selectedCar.image} alt={selectedCar.name} className="summary-car-img"  onError={(e) => e.target.src = "/assets/images/default-car.jpg"} />
                  <h4 className="summary-car-name">{selectedCar.name}</h4>
                </div>
                <div className="summary-details">
                  <div className="left-column">
                    <p>
                      <strong>Date:</strong> {bookingDetails.pickupStartDate}
                    </p>
                    <p>
                      <strong>Duration:</strong> {calculateDurationInHours()} hours
                    </p>
                    <p>
                      <strong>Pickup:</strong> {bookingDetails.pickupLocation}
                    </p>
                    <p>
                      <strong>Drop-off:</strong> {bookingDetails.dropoffLocation}
                    </p>
                  </div>
                  <div className="right-column">
                    <p>
                      <strong>Time:</strong> {bookingDetails.pickupStartTime} to {bookingDetails.dropoffEndTime}
                    </p>
                    <p>
                      <strong>Passengers:</strong> {selectedCar.passengers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="price-summary">
                <div>
                  <span>Vehicle Rental ({calculateDurationInHours()} hours):</span>
                  <span>${calculateRentalCost()}</span>
                </div>
                <div>
                  <span>Service Fee:</span>
                  <span>${SERVICE_FEE}</span>
                </div>
                <hr />
                <div>
                  <strong>Total:</strong>
                  <strong>${calculateTotalCost()}</strong>
                </div>
              </div>

              {/* Payment Method Selection */}
              <label className="payment-method-label" htmlFor="paymentMethod">
                Please select a payment method:
              </label>
              <select
                id="paymentMethod"
                className="payment-method-dropdown"
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
              >
                <option value="creditCard">Credit Card</option>
                <option value="upi">UPI</option>
                <option value="bankTransfer">Bank Transfer</option>
              </select>

              {/* Render Credit Card Payment Form */}
              {selectedPaymentMethod === "creditCard" && (
                <form className="payment-form">
                  <h3>Credit Card Payment</h3>
                  <label>Cardholder Name</label>
                  <input type="text" placeholder="Name as it appears on the card" />
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="card-number-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                  />
                  <div className="card-details">
                    <label>
                      Expiry Date
                      <input
                        type="text"
                        placeholder="MM/YY"
                        onChange={handleExpiryDateChange} // Attach the Expiry Date handler
                        maxLength="5" // Limit input to 5 characters including "/"
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="text"
                        placeholder="123"
                        onChange={handleCVVChange} // Attach the CVV handler
                        maxLength="3" // Limit input to 3 characters
                      />
                    </label>
                  </div>
                </form>
              )}

              {/* Render UPI Payment Form */}
              {selectedPaymentMethod === "upi" && (
                <form className="payment-form">
                  <h3>UPI Payment</h3>
                  <label>UPI ID</label>
                  <input type="text" placeholder="example@upi" />
                </form>
              )}

              {/* Render Bank Transfer Form */}
              {selectedPaymentMethod === "bankTransfer" && (
                <form className="payment-form">
                  <h3>Bank Transfer</h3>
                  <label>Bank Account Number</label>
                  <input type="text" placeholder="Enter your bank account number" />
                  <label>IFSC Code</label>
                  <input type="text" placeholder="Enter IFSC code" />
                </form>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="cancel-button" onClick={() => handleTabClick("contact")}>
                  Back
                </button>
                <button 
                  className={`confirm-button ${isSubmitting ? "submitting" : ""}`} 
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          )}

          {/* Booking Confirmation Page */}
          {activeTab === "confirmed" && isBookingConfirmed && selectedCar && (
            <div className="confirmation-page">
              <div className="confirmation-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>Booking Confirmed!</h2>
              <p className="confirmation-message">
                Thank you for your booking. Your reservation has been successfully confirmed.
              </p>
              <div className="confirmation-details">
                <div className="confirmation-ref">
                  <h3>Booking Reference</h3>
                  <p className="ref-number">{bookingRef}</p>
                </div>
                
                <div className="confirmation-summary">
                  <h3>Booking Summary</h3>
                  
                  <div className="summary-car">
                    <img src={selectedCar.image} alt={selectedCar.name} className="summary-car-img" 
                     onError={(e) => e.target.src = "/assets/default-car.jpg"} />
                    <div className="summary-car-info">
                      <h4 className="summary-car-name">{selectedCar.name}</h4>
                      <p className="summary-car-category">{selectedCar.category}</p>
                    </div>
                  </div>
                  
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">Booking Date</span>
                      <span className="summary-value">{getCurrentDate()}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Customer</span>
                      <span className="summary-value">{contactDetails.fullName}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Email</span>
                      <span className="summary-value">{contactDetails.email}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Phone</span>
                      <span className="summary-value">{contactDetails.phoneNumber}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Pickup Date</span>
                      <span className="summary-value">{formatDate(bookingDetails.pickupStartDate)}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Pickup Time</span>
                      <span className="summary-value">{bookingDetails.pickupStartTime}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Pickup Location</span>
                      <span className="summary-value">{bookingDetails.pickupLocation}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Dropoff Location</span>
                      <span className="summary-value">{bookingDetails.dropoffLocation}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Duration</span>
                      <span className="summary-value">{calculateDurationInHours()} hours</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Payment Method</span>
                      <span className="summary-value">
                        {selectedPaymentMethod === "creditCard" ? "Credit Card" : 
                         selectedPaymentMethod === "upi" ? "UPI" : "Bank Transfer"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="confirmation-price">
                    <div className="price-row">
                      <span>Rental Cost</span>
                      <span>${calculateRentalCost()}</span>
                    </div>
                    <div className="price-row">
                      <span>Service Fee</span>
                      <span>${SERVICE_FEE}</span>
                    </div>
                    <div className="price-row total">
                      <span>Total Paid</span>
                      <span>${calculateTotalCost()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="confirmation-actions">
                <button className="print-button" onClick={handlePrint}>
                  <i className="fas fa-print"></i> Print Receipt
                </button>
                <button 
                  className="view-booking-button" 
                  onClick={() => navigate(`/confirmation/${bookingRef}`)}
                >
                  View Booking Details
                </button>
                <button className="home-button" onClick={() => navigate("/")}>
                  Return to Home
                </button>
              </div>
              
              <div className="confirmation-footer">
                <p>A confirmation email has been sent to {contactDetails.email}</p>
                <p>For any queries, please contact our support team.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookNow;