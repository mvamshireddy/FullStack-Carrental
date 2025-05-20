import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";
import "./BookNow.css";
import { allCars } from "../data/cars";
import { createBooking } from "../services/booking"; // <-- API service for backend integration

const SERVICE_FEE = 25; // Fixed service fee

const BookNow = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("vehicle");
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState(""); // <-- Error message for booking API

  // Pre-fill selectedCar from localStorage on load
  useEffect(() => {
    const storedCar = localStorage.getItem("selectedCar");
    if (storedCar) {
      setSelectedCar(JSON.parse(storedCar));
      setActiveTab("details");
      localStorage.removeItem("selectedCar");
    }
  }, []);

  // Card/UPI/Bank field handlers (validation/formatting)
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };
  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
    e.target.value = value;
  };
  const handleCVVChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    e.target.value = value;
  };

  // Generate booking reference
  const generateBookingRef = () => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 8);
    const random = Math.floor(100000 + Math.random() * 900000);
    return `REF-${timestamp}-${random}`;
  };

  // Date formatting helpers
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const getCurrentDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };
  const handlePrint = () => window.print();

  // Booking details and contact
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

  // Tabs, Car, and Form handlers
  const handleTabClick = (tab) => setActiveTab(tab);
  const handleCarSelection = (car) => setSelectedCar(car);
  const handleBookingDetailsChange = (field, value) => {
    setBookingDetails((prev) => ({ ...prev, [field]: value }));
  };
  const handleContactDetailsChange = (field, value) => {
    setContactDetails((prev) => ({ ...prev, [field]: value }));
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({ ...prev, email: emailRegex.test(value) ? "" : "Invalid email format." }));
    }
    if (field === "phoneNumber") {
      const phoneRegex = /^\d{10}$/;
      setErrors((prev) => ({ ...prev, phoneNumber: phoneRegex.test(value) ? "" : "Phone number must be 10 digits." }));
    }
  };

  // Pricing helpers
  const calculateDurationInHours = () => {
    if (!bookingDetails.pickupStartDate || !bookingDetails.dropoffEndDate) return 0;
    const start = new Date(`${bookingDetails.pickupStartDate}T${bookingDetails.pickupStartTime}`);
    const end = new Date(`${bookingDetails.dropoffEndDate}T${bookingDetails.dropoffEndTime}`);
    const diffInMs = end - start;
    return Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60)));
  };
  const calculateRentalCost = () => {
    const duration = calculateDurationInHours();
    return selectedCar ? selectedCar.price * duration : 0;
  };
  const calculateTotalCost = () => calculateRentalCost() + SERVICE_FEE;

  // Form completeness checks
  const isDetailsPageComplete = () => (
    bookingDetails.pickupStartDate &&
    bookingDetails.pickupStartTime &&
    bookingDetails.dropoffEndDate &&
    bookingDetails.dropoffEndTime &&
    bookingDetails.pickupLocation &&
    bookingDetails.dropoffLocation
  );
  const isContactPageComplete = () => (
    contactDetails.fullName &&
    contactDetails.email &&
    contactDetails.phoneNumber &&
    !errors.email &&
    !errors.phoneNumber
  );

  // SUBMIT: Confirm booking and send to backend
  const handleConfirmBooking = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setBookingError("");

    try {
      // Payment method validation
      if (selectedPaymentMethod === "creditCard" && !cardNumber) {
        setBookingError("Please complete the credit card details before confirming the booking.");
        setIsSubmitting(false);
        return;
      }
      if (selectedPaymentMethod === "upi" && !document.querySelector('input[placeholder="example@upi"]').value) {
        setBookingError("Please enter your UPI ID before confirming the booking.");
        setIsSubmitting(false);
        return;
      }
      if (selectedPaymentMethod === "bankTransfer" &&
        (!document.querySelector('input[placeholder="Enter your bank account number"]').value ||
          !document.querySelector('input[placeholder="Enter IFSC code"]').value)) {
        setBookingError("Please complete the bank transfer details before confirming the booking.");
        setIsSubmitting(false);
        return;
      }

      // Generate booking reference
      const ref = generateBookingRef();
      setBookingRef(ref);

      // Prepare booking data for backend
      const bookingData = {
        bookingRef: ref,
        car: selectedCar,
        bookingDetails,
        contactDetails,
        paymentMethod: selectedPaymentMethod,
        totalCost: calculateTotalCost(),
        serviceFee: SERVICE_FEE,
        bookingDate: getCurrentDate(),
        timestamp: new Date().toISOString()
      };

      // Send booking to backend
      await createBooking(bookingData);

      setIsBookingConfirmed(true);
      setTimeout(() => {
        navigate(`/confirmation/${ref}`);
      }, 1500);
    } catch (error) {
      setBookingError(
        error?.response?.data?.message ||
        "There was an error processing your booking. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const allVehicles = allCars;

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
          {bookingError && (
            <div style={{ color: "red", textAlign: "center", margin: "12px 0" }}>
              {bookingError}
            </div>
          )}

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
                      hideBookNowButton={true}
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
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) => handleBookingDetailsChange("pickupStartDate", e.target.value)}
                  />
                </label>
                <label>
                  Pickup/Start Time
                  <input
                    type="time"
                    value={bookingDetails.pickupStartTime}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) => handleBookingDetailsChange("pickupStartTime", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off/End Date
                  <input
                    type="date"
                    value={bookingDetails.dropoffEndDate}
                    onClick={(e) => e.target.showPicker()}
                    onChange={(e) => handleBookingDetailsChange("dropoffEndDate", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off/End Time
                  <input
                    type="time"
                    value={bookingDetails.dropoffEndTime}
                    onClick={(e) => e.target.showPicker()}
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
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <div className="summary-car">
                  <img src={selectedCar.image} alt={selectedCar.name} className="summary-car-img" onError={(e) => e.target.src = "/assets/images/default-car.jpg"} />
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
                        onChange={handleExpiryDateChange}
                        maxLength="5"
                      />
                    </label>
                    <label>
                      CVV
                      <input
                        type="text"
                        placeholder="123"
                        onChange={handleCVVChange}
                        maxLength="3"
                      />
                    </label>
                  </div>
                </form>
              )}
              {selectedPaymentMethod === "upi" && (
                <form className="payment-form">
                  <h3>UPI Payment</h3>
                  <label>UPI ID</label>
                  <input type="text" placeholder="example@upi" />
                </form>
              )}
              {selectedPaymentMethod === "bankTransfer" && (
                <form className="payment-form">
                  <h3>Bank Transfer</h3>
                  <label>Bank Account Number</label>
                  <input type="text" placeholder="Enter your bank account number" />
                  <label>IFSC Code</label>
                  <input type="text" placeholder="Enter IFSC code" />
                </form>
              )}
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