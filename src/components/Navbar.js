import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import './Navbar.css';


const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu open/close
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          {/* Logo wrapped in Link for navigation */}
          <Link to="/" className="logo-link">
            <h1>
              Shadow <span className="highlight">Drive</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links desktop-links">
          <li>
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link to="/vehicles" className="nav-link">
              Our Vehicles
            </Link>
          </li>
          <li>
            <Link to="/services" className="nav-link">
              Services
            </Link>
          </li>
          <li>
            <Link to="/about" className="nav-link">
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>

        {/* Book Now Button and User Icon for Desktop */}
        <div className="navbar-actions desktop-actions">
          <button className="btn-book-now">Book Now</button>
          <Link to="/login">
            <FaUser className="user-icon" />
          </Link>
        </div>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`navbar-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
            <li>
              <Link to="/" className="nav-link" onClick={toggleMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/vehicles" className="nav-link" onClick={toggleMobileMenu}>
                Our Vehicles
              </Link>
            </li>
            <li>
              <Link to="/services" className="nav-link" onClick={toggleMobileMenu}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/about" className="nav-link" onClick={toggleMobileMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="nav-link" onClick={toggleMobileMenu}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Book Now Button */}
          <button className="btn-book-now" onClick={toggleMobileMenu}>
            Book Now
          </button>

          {/* Sign In / Register Link */}
          <div className="navbar-signin">
            <Link to="/signin" onClick={toggleMobileMenu}>
              Sign In / Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;