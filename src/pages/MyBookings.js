import React, { useState } from "react";
import "./MyBookings.css";

// Dummy bookings for UI (replace with API in real usage)
const bookings = [
  {
    id: 1,
    city: "Manchester",
    address: "123 Powerline Ave, Spark City",
    vehicle: "Electra spot station",
    date: "Jun 6, 2025",
    time: "10:00 AM",
    charger: "Type 2",
    duration: "1.5 hours",
    status: "Canceled",
    canBookAgain: true,
    canSeeDetails: true,
  },
  {
    id: 2,
    city: "Manchester",
    address: "123 Powerline Ave, Spark City",
    vehicle: "Electra spot station",
    date: "Jun 6, 2025",
    time: "10:00 AM",
    charger: "Type 2",
    duration: "1.5 hours",
    status: "Canceled",
    canBookAgain: true,
    canSeeDetails: true,
  },
  // ... More bookings
];

// Tab names
const TABS = ["Upcoming", "Completed", "Canceled"];

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
  const [activeTab, setActiveTab] = useState("Canceled");

  // Filtered bookings by active tab
  const filtered = bookings.filter(b => b.status === activeTab);

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