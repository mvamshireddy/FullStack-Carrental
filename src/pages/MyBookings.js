import React, { useState, useEffect } from "react";
import { getBookings } from "../services/booking";
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

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("Upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  let firstLoad = true;
  let isMounted = true;

  const fetchData = () => {
    if (firstLoad) setLoading(true); // Only show loading on first load
    setError(null);
    getBookings()
      .then(res => {
        if (!isMounted) return;
        const data = (res.data.bookings || res.data || []).map(b => ({
          ...b,
          city: b.pickupLocation || b.city || "",
          address: b.dropoffLocation || b.address || "",
          vehicle: b.car?.name || b.staticCar?.name || b.vehicle || "",
          date: b.startTime ? new Date(b.startTime).toLocaleDateString() : b.date || "",
          time: b.startTime ? new Date(b.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : b.time || "",
          charger: b.charger || "",
          duration: b.startTime && b.endTime
            ? `${Math.ceil((new Date(b.endTime) - new Date(b.startTime)) / (60 * 60 * 1000))} hours`
            : b.duration || "",
          status: STATUS_MAP[b.status] || b.status,
          canBookAgain: true,
          canSeeDetails: true,
          id: b._id || b.id,
        }));
        setBookings(data);
      })
      .catch(() => {
        if (isMounted) setError("Could not fetch bookings");
      })
      .finally(() => {
        if (firstLoad) setLoading(false);
        firstLoad = false;
      });
  };

  fetchData();
  const interval = setInterval(fetchData, 20000); // 20 seconds
  return () => {
    isMounted = false;
    clearInterval(interval);
  };
}, []);


  const filtered = bookings.filter(b => b.status === activeTab);

  if (loading) return <div className="mybookings-root"><div className="mybookings-content"><div>Loading...</div></div></div>;
  if (error) return <div className="mybookings-root"><div className="mybookings-content"><div>{error}</div></div></div>;

  return (
    <div className="mybookings-root">
      <div className="mybookings-content">
        <h1 className="mybookings-title">My Bookings</h1>
        {/* Tabs */}
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
        {/* Desktop View */}
        <div className="mybookings-desktop">
          {filtered.length === 0 ? (
            <EmptyIcon />
          ) : filtered.map(b => (
            <div className="mybookings-desk-card" key={b.id}>
              <div className="desk-card-header">
                <div className="desk-card-avatar"/>
                <div>
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
                    <span className="desk-card-label">Charger:</span>
                    <span className="desk-card-value">{b.charger}</span>
                  </div>
                  <div className="desk-card-row">
                    <span className="desk-card-label">Duration:</span>
                    <span className="desk-card-value">{b.duration}</span>
                  </div>
                </div>
                <div className="desk-card-actions">
                  {b.canSeeDetails && (
                    <button className="desk-card-btn details">Details</button>
                  )}
                  {b.canBookAgain && (
                    <button className="desk-card-btn primary">Book Again</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Mobile View */}
        <div className="mybookings-mobile">
          {filtered.length === 0 ? (
            <EmptyIcon />
          ) : filtered.map(b => (
            <div className="mybookings-mob-card" key={b.id}>
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
                  <span className="mob-label">Charger</span>
                  <span className="mob-spec-val">{b.charger}</span>
                </div>
                <div>
                  <span className="mob-label">Duration</span>
                  <span className="mob-spec-val">{b.duration}</span>
                </div>
              </div>
              <div className="mob-card-row mob-card-actions">
                {b.canSeeDetails && (
                  <button className="mob-card-btn details">Details</button>
                )}
                {b.canBookAgain && (
                  <button className="mob-card-btn primary">Book Again</button>
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