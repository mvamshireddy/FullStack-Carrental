import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api from "../services/axios";
import { createBooking } from "../services/booking";
import "./BookNow.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUB_KEY);

const SERVICE_FEE = 25;

// Static vehicles
const staticVehicles = [
  {
    id: 1,
    name: "Mercedes S-Class",
    image: "/assests/images/mercedes-s-class.png",
    description: "The pinnacle of luxury sedans, offering unmatched comfort for executive travel.",
    price: 120,
    passengers: 3,
    luggage: 2,
    category: "Luxury Sedans",
  },
  {
    id: 2,
    name: "BMW 7 Series",
    image: "/assests/images/bmw-7-series.png",
    description: "Blend of performance and luxury with spacious interior for business or leisure.",
    price: 110,
    passengers: 3,
    luggage: 2,
    category: "Luxury Sedans",
  },
  {
    id: 3,
    name: "Cadillac Escalade",
    image: "/assests/images/cadillac-escalade.png",
    description: "Spacious luxury SUV perfect for group travel with ample luggage space.",
    price: 150,
    passengers: 6,
    luggage: 4,
    category: "Premium SUVs",
  },
  {
    id: 4,
    name: "Range Rover",
    image: "/assests/images/range-rover.png",
    description: "The epitome of luxury SUVs, combining opulence with off-road capability.",
    price: 140,
    passengers: 4,
    luggage: 3,
    category: "Premium SUVs",
  },
  {
    id: 5,
    name: "Mercedes V-Class",
    image: "/assests/images/mercedes-v-class.png",
    description: "Spacious luxury van for group travel with exceptional comfort.",
    price: 160,
    passengers: 5,
    luggage: 5,
    category: "Luxury Vans",
  },
  {
    id: 6,
    name: "Rolls-Royce Phantom",
    image: "/assests/images/rolls-royce.png",
    description: "The ultimate symbol of prestige and luxury for special occasions.",
    price: 300,
    passengers: 3,
    luggage: 2,
    category: "Ultra Luxury",
  },
];

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#333",
      fontSize: "16px",
      fontFamily: "inherit",
      backgroundColor: "#fafbfc",
      border: "1px solid #ddd",
      borderRadius: "4px",
      padding: "12px",
      '::placeholder': {
        color: "#999",
      },
    },
    invalid: {
      color: "#e5424d",
    },
  },
  hidePostalCode: true,
};

const BookNow = () => {
  const navigate = useNavigate();
  const [backendVehicles, setBackendVehicles] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [activeTab, setActiveTab] = useState("vehicle");
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
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
  const [errors, setErrors] = useState({ email: "", phoneNumber: "" });

  // Auth check: redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login?redirect=/booknow");
    }
  }, [navigate]);

  // Prefill from Book Again
  useEffect(() => {
    const bookAgainDataRaw = localStorage.getItem("bookAgainData");
    if (bookAgainDataRaw) {
      const bookAgainData = JSON.parse(bookAgainDataRaw);
      if (bookAgainData.car) setSelectedCar(bookAgainData.car);
      setBookingDetails(prev => ({
        ...prev,
        pickupLocation: bookAgainData.pickupLocation || "",
        dropoffLocation: bookAgainData.dropoffLocation || "",
      }));
      if (bookAgainData.contactDetails) setContactDetails(bookAgainData.contactDetails);
      if (bookAgainData.skipToPayment) setActiveTab("payment");
      localStorage.removeItem("bookAgainData");
    }
  }, []);

  // Fetch backend vehicles
  useEffect(() => {
    api.get("/cars")
      .then(res => setBackendVehicles(res.data || []))
      .catch(() => setBackendVehicles([]));
  }, []);

  // Merge vehicles, avoid duplicates by name
  useEffect(() => {
    setAllVehicles([
      ...staticVehicles,
      ...backendVehicles.filter(
        (bcar) => !staticVehicles.some((scar) => scar.name === bcar.name)
      ),
    ]);
  }, [backendVehicles]);

  // Preselect car if coming from another page
  useEffect(() => {
    const storedCar = localStorage.getItem("selectedCar");
    if (storedCar) {
      setSelectedCar(JSON.parse(storedCar));
      setActiveTab("details");
      localStorage.removeItem("selectedCar");
    }
  }, []);

  // Tab, car, and form handlers
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

  // Price helpers
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

  // Check if form tabs are complete
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

  // Stripe Payment Section
  function PaymentSection({ amount, onPaymentSuccess, onError }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handlePayment = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const { data } = await api.post("/api/payments/create-intent", { amount, currency: "usd" });
        const clientSecret = data.clientSecret;

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        });

        setLoading(false);
        if (error) {
          onError(error.message);
        } else if (paymentIntent.status === "succeeded") {
          onPaymentSuccess(paymentIntent.id);
        }
      } catch (err) {
        setLoading(false);
        onError(err.response?.data?.message || err.message || "Payment failed");
      }
    };

    return (
      <form onSubmit={handlePayment} className="payment-form">
        <h3>Enter Card Details</h3>
        <div className="custom-card-element">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <button type="submit" disabled={!stripe || loading} className="confirm-button" style={{marginTop: 16}}>
          {loading ? "Processing..." : "Pay & Confirm Booking"}
        </button>
      </form>
    );
  }

  // Booking confirmation handler (calls backend after payment)
  const handleBookingAfterPayment = async (paymentIntentId) => {
    setIsSubmitting(true);
    setBookingError("");

    try {
      const ref = generateBookingRef();
      setBookingRef(ref);

      const startTime = new Date(
        `${bookingDetails.pickupStartDate}T${bookingDetails.pickupStartTime}`
      ).toISOString();
      const endTime = new Date(
        `${bookingDetails.dropoffEndDate}T${bookingDetails.dropoffEndTime}`
      ).toISOString();

      let carType, carId, carDetails;
      if (selectedCar && selectedCar._id) {
        carType = "backend";
        carId = selectedCar._id;
      } else if (selectedCar && selectedCar.id) {
        carType = "static";
        carDetails = selectedCar;
      }

      if ((!carId && carType !== "static") || (carType === "static" && !carDetails)) {
        setBookingError("Selected car is not available for booking. Please select a different vehicle.");
        setIsSubmitting(false);
        return;
      }

      // Only send required fields
      const bookingData = {
        referenceId: ref,
        carType,
        startTime,
        endTime,
        pickupLocation: bookingDetails.pickupLocation,
        dropoffLocation: bookingDetails.dropoffLocation,
        status: "active",
        paymentIntentId,
        contactDetails,
        ...(carType === "backend" ? { car: carId } : {}),
        ...(carType === "static" ? { carDetails } : {}),
      };

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

  // Generate booking reference
  const generateBookingRef = () => {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 8);
    const random = Math.floor(100000 + Math.random() * 900000);
    return `REF-${timestamp}-${random}`;
  };

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

  // --- UI ---
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
              onClick={() => setActiveTab("payment")}
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
                      key={car._id || car.id || car.name}
                      car={car}
                      isSelected={
                        selectedCar
                          ? (car._id && selectedCar._id && car._id === selectedCar._id) ||
                            (car.id && selectedCar.id && car.id === selectedCar.id)
                          : false
                      }
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
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    onChange={(e) => handleBookingDetailsChange("pickupStartDate", e.target.value)}
                  />
                </label>
                <label>
                  Pickup/Start Time
                  <input
                    type="time"
                    value={bookingDetails.pickupStartTime}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    onChange={(e) => handleBookingDetailsChange("pickupStartTime", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off/End Date
                  <input
                    type="date"
                    value={bookingDetails.dropoffEndDate}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
                    onChange={(e) => handleBookingDetailsChange("dropoffEndDate", e.target.value)}
                  />
                </label>
                <label>
                  Drop-off/End Time
                  <input
                    type="time"
                    value={bookingDetails.dropoffEndTime}
                    onClick={(e) => e.target.showPicker && e.target.showPicker()}
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
              {/* Stripe Elements Payment */}
              <Elements stripe={stripePromise}>
                <PaymentSection
                  amount={calculateTotalCost()}
                  onPaymentSuccess={handleBookingAfterPayment}
                  onError={setBookingError}
                />
              </Elements>
              <div className="action-buttons">
                <button className="cancel-button" onClick={() => handleTabClick("contact")}>
                  Back
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
                      <span className="summary-value">Credit Card</span>
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