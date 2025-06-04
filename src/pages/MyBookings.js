import React, { useState, useEffect, useRef } from "react";
import { getBookings, cancelBooking } from "../services/booking";
import "./MyBookings.css";

const TABS = ["Upcoming", "Completed", "Canceled"];
const STATUS_MAP = {
  active: "Upcoming",
  completed: "Completed",
  cancelled: "Canceled",
};

const EmptyIcon = () => (
  <div className="mybookings-empty">
    <svg width="90" height="90" fill="none" viewBox="0 0 90 90">
      <rect width="90" height="90" rx="17" fill="#e6ecf8"/>
      <path d="M29 57c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="45" cy="41" r="8" stroke="#2563eb" strokeWidth="2"/>
      <circle cx="45" cy="45" r="44" stroke="#e0e7ef" strokeWidth="2"/>
    </svg>
    <div className="empty-text">No bookings found</div>
  </div>
);

const getBookingCarImg = (booking) => {
  let carImg = booking.car?.image || booking.staticCar?.image || "/assests/images/default-car.jpg";
  if (carImg && carImg.includes("/assests/")) {
    carImg = carImg.replace("/assests/", "/assests/");
  }
  return carImg;
};

const getBookingAmount = (booking) => {
  if (booking.amount && !isNaN(Number(booking.amount))) {
    return `₹${booking.amount}`;
  }
  const carPrice = booking.car?.price || booking.staticCar?.price || 0;
  const start = booking.startTime ? new Date(booking.startTime) : null;
  const end = booking.endTime ? new Date(booking.endTime) : null;
  let durationHours = 1;
  if (start && end && end > start) {
    durationHours = Math.ceil((end - start) / (60 * 60 * 1000));
  }
  let amount = carPrice * durationHours;
  if (booking.serviceFee) amount += Number(booking.serviceFee);
  return `₹${amount}`;
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [loading, setLoading] = useState(true); // only for initial load
  const [refreshing, setRefreshing] = useState(false); // for background refreshes
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;

    const fetchData = async (isInitial = false) => {
      if (isInitial) setLoading(true);
      else setRefreshing(true);

      setError(null);
      try {
        const res = await getBookings();
        if (!isMounted.current) return;
        const now = new Date();
        const data = (res.data.bookings || res.data || []).map(b => {
          const endTime = b.endTime ? new Date(b.endTime) : null;
          let effectiveStatus = b.status;
          if (effectiveStatus !== "cancelled" && endTime && now > endTime) {
            effectiveStatus = "completed";
          }
          if (effectiveStatus === "cancelled") effectiveStatus = "cancelled";
          if (effectiveStatus === "active" || effectiveStatus === "upcoming") effectiveStatus = "active";
          return {
            ...b,
            city: b.pickupLocation || b.city || "",
            address: b.dropoffLocation || b.address || "",
            vehicle: b.car?.name || b.staticCar?.name || b.vehicle || "",
            carImg: getBookingCarImg(b),
            date: b.startTime ? new Date(b.startTime).toLocaleDateString() : b.date || "",
            time: b.startTime ? new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.time || "",
            amount: getBookingAmount(b),
            duration: b.startTime && b.endTime
              ? `${Math.ceil((new Date(b.endTime) - new Date(b.startTime)) / (60 * 60 * 1000))} hours`
              : b.duration || "",
            status: STATUS_MAP[effectiveStatus] || effectiveStatus,
            _status: effectiveStatus,
            canBookAgain: true,
            canSeeDetails: true,
            id: b._id || b.id,
          };
        });
        setBookings(data);
      } catch (e) {
        if (isMounted.current) setError("Could not fetch bookings");
      } finally {
        if (isInitial) setLoading(false);
        else setRefreshing(false);
      }
    };

    // Initial load with spinner
    fetchData(true);

    // Background refresh without spinner
    const interval = setInterval(() => fetchData(false), 20000);

    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, []);

  const filtered = bookings.filter(b => b.status === activeTab);

  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setBookings(prev =>
        prev.map(b =>
          b.id === bookingId
            ? { ...b, status: "Canceled", _status: "cancelled" }
            : b
        )
      );
      setActiveTab("Canceled");
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
  };

  const handleBookAgain = (booking) => {
    const bookAgainData = {
      car: booking.car || booking.staticCar,
      contactDetails: booking.contactDetails,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.dropoffLocation,
      skipToPayment: true
    };
    localStorage.setItem("bookAgainData", JSON.stringify(bookAgainData));
    window.location.href = "/booknow";
  };

  // Only show full page spinner on initial load
  if (loading) return <div className="mybookings-root"><div className="mybookings-content"><div>Loading...</div></div></div>;
  if (error) return <div className="mybookings-root"><div className="mybookings-content"><div>{error}</div></div></div>;

  // Optionally, you can show a tiny spinner in the header or as a faded overlay
  // if (refreshing) ... (see CSS example below)

  return (
    <div className="mybookings-root">
      <div className="mybookings-content">
        <h1 className="mybookings-title">
          My Bookings
          {refreshing && <span className="mybookings-refresh-indicator" title="Refreshing..." />}
        </h1>
        <div className="mybookings-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`mybookings-tab-btn${activeTab === tab ? " active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mybookings-desktop">
          {filtered.length === 0 ? (
            <EmptyIcon />
          ) : filtered.map(b => (
            <div className="mybookings-desk-card" key={b.id}>
              <div className="desk-card-header">
                <div className="desk-card-imgwrap">
                  <img
                    src={b.carImg}
                    alt={b.vehicle}
                    className="mybookings-car-img"
                    onError={e => { e.target.src = "/assests/images/default-car.jpg"; }}
                  />
                </div>
                <div className="desk-card-header-meta">
                  <div className="desk-card-city">{b.city}</div>
                  <div className="desk-card-address">{b.address}</div>
                </div>
                <div className={`desk-card-status status-${b.status.toLowerCase()}`}>{b.status}</div>
              </div>
              <div className="desk-card-content">
                <div className="desk-card-main">
                  <div className="desk-card-row">
                    <span className="desk-card-label">Vehicle:</span>
                    <span className="desk-card-value">{b.vehicle}</span>
                  </div>
                  <div className="desk-card-row">
                    <span className="desk-card-label">Date:</span>
                    <span className="desk-card-value">{b.date}</span>
                  </div>
                  <div className="desk-card-row">
                    <span className="desk-card-label">Time:</span>
                    <span className="desk-card-value">{b.time}</span>
                  </div>
                  <div className="desk-card-row">
                    <span className="desk-card-label">Duration:</span>
                    <span className="desk-card-value">{b.duration}</span>
                  </div>
                  <div className="desk-card-row">
                    <span className="desk-card-label">Amount Paid:</span>
                    <span className="desk-card-value">{b.amount}</span>
                  </div>
                </div>
                <div className="desk-card-actions">
                  {b.canSeeDetails && (
                    <button className="desk-card-btn details">Details</button>
                  )}
                  {b.canBookAgain && (
                    <button className="desk-card-btn primary" onClick={() => handleBookAgain(b)}>
                      Book Again
                    </button>
                  )}
                  {activeTab === "Upcoming" && (
                    <button
                      className="desk-card-btn cancel"
                      style={{ background: "#f44336", color: "#fff", borderColor: "#f44336" }}
                      onClick={() => handleCancelBooking(b.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mybookings-mobile">
          {filtered.length === 0 ? (
            <EmptyIcon />
          ) : filtered.map(b => (
            <div className="mybookings-mob-card" key={b.id}>
              <div style={{padding: "10px 0"}}>
                <img
                  src={b.carImg}
                  alt={b.vehicle}
                  className="mybookings-car-img"
                  onError={e => { e.target.src = "/assests/images/default-car.jpg"; }}
                />
              </div>
              <div className="mob-card-row">
                <div className="mob-card-date">
                  <span className="mob-icon-calendar" />
                  <span>{b.date}</span>
                </div>
                <div className={`mob-card-status status-${b.status.toLowerCase()}`}>
                  <span>{b.status}</span>
                </div>
              </div>
              <div className="mob-card-row mob-card-title">{b.vehicle}</div>
              <div className="mob-card-row mob-card-address">{b.address}</div>
              <div className="mob-card-row mob-card-specs">
                <div>
                  <span className="mob-label">Duration</span>
                  <span className="mob-spec-val">{b.duration}</span>
                </div>
                <div>
                  <span className="mob-label">Amount Paid</span>
                  <span className="mob-spec-val">{b.amount}</span>
                </div>
              </div>
              <div className="mob-card-row mob-card-actions">
                {b.canSeeDetails && (
                  <button className="mob-card-btn details">Details</button>
                )}
                {b.canBookAgain && (
                  <button className="mob-card-btn primary" onClick={() => handleBookAgain(b)}>
                    Book Again
                  </button>
                )}
                {activeTab === "Upcoming" && (
                  <button
                    className="mob-card-btn cancel"
                    style={{ background: "#f44336", color: "#fff", borderColor: "#f44336" }}
                    onClick={() => handleCancelBooking(b.id)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;