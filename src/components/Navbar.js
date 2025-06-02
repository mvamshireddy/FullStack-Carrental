import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCalendarAlt, FaCog, FaSignOutAlt } from "react-icons/fa";
import "./Navbar.css";

const getUserInfo = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) return user;
    const token = localStorage.getItem("token");
    if (!token) return {};
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      name: payload.name || payload.username || "",
      email: payload.email || "",
      photoURL: payload.photoURL || "",
    };
  } catch {
    return {};
  }
};

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = getUserInfo();

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const hiLabel = isLoggedIn && user.name
    ? `Hi, ${user.name}`
    : "Hi, Login";

  const handleHiClick = () => {
    if (isLoggedIn) {
      setDropdownOpen((v) => !v);
    } else {
      navigate("/login");
    }
  };

  const renderProfileImage = () => {
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="Profile"
          className="navbar-profile-img"
        />
      );
    }
    return (
      <div className="navbar-profile-placeholder">
        <FaUser />
      </div>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-blue">Shadow</span>
          <span className="highlight"> Drive</span>
        </Link>
        <ul className="navbar-links desktop-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/vehicles" className="nav-link">Our Vehicles</Link></li>
          <li><Link to="/services" className="nav-link">Services</Link></li>
          <li><Link to="/about" className="nav-link">About Us</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>
        <div className="navbar-actions desktop-actions">
          <div
            className="profile-dropdown-container"
            ref={dropdownRef}
          >
            <div
              onClick={handleHiClick}
              className="navbar-profile-trigger"
              title={isLoggedIn && user.name ? user.name : "Login"}
            >
              {renderProfileImage()}
              <span className="navbar-hi-label">
                {hiLabel}
              </span>
            </div>
            {isLoggedIn && dropdownOpen && (
              <div className="profile-dropdown-menu">
                <div className="profile-dropdown-header">
                  {renderProfileImage()}
                  <div>
                    <div className="profile-dropdown-name">{user.name}</div>
                    {user.email && <div className="profile-dropdown-email">{user.email}</div>}
                  </div>
                </div>
                <Link
                  to="/bookings"
                  className="dropdown-link"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaCalendarAlt className="dropdown-icon" />
                  My Bookings
                </Link>
                <Link
                  to="/settings"
                  className="dropdown-link"
                  onClick={() => setDropdownOpen(false)}
                >
                  <FaCog className="dropdown-icon" />
                  Settings
                </Link>
                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="dropdown-icon" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="mobile-menu-icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          &#9776;
        </div>
      </div>
      <div className={`navbar-overlay${mobileMenuOpen ? " open" : ""}`} onClick={() => setMobileMenuOpen(false)}>
        <ul className="navbar-links">
          <li><Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
          <li><Link to="/vehicles" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Our Vehicles</Link></li>
          <li><Link to="/services" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Services</Link></li>
          <li><Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
          <li><Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/bookings" className="nav-link" onClick={() => setMobileMenuOpen(false)}>My Bookings</Link>
              </li>
              <li>
                <Link to="/settings" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Settings</Link>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <span
                onClick={() => { setMobileMenuOpen(false); navigate("/login"); }}
                className="navbar-hi-label navbar-hi-label-mobile"
              >
                Hi, Login
              </span>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;