import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import './Navbar.css';

// Util to get user name from token payload (JWT)
function getUserNameFromToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    const payload = JSON.parse(jsonPayload);
    return payload.name || payload.username || null;
  } catch {
    return null;
  }
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Try to get the user name from token or user object in localStorage
    const token = localStorage.getItem("token");
    let name = '';
    if (token) {
      // If your backend encodes name in JWT, use this:
      name = getUserNameFromToken();
      // If you also save the user object, fallback:
      if (!name) {
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          name = user?.name || '';
        } catch {}
      }
    }
    setUserName(name);
  }, []);

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login?redirect=/booknow");
    } else {
      navigate("/booknow");
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/" className="logo-link">
            <h1>
              Shadow <span className="highlight">Drive</span>
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar-links desktop-links">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/vehicles" className="nav-link">Our Vehicles</Link></li>
          <li><Link to="/services" className="nav-link">Services</Link></li>
          <li><Link to="/about" className="nav-link">About Us</Link></li>
          <li><Link to="/contact" className="nav-link">Contact</Link></li>
        </ul>

        {/* Book Now Button and User Icon for Desktop */}
        <div className="navbar-actions desktop-actions">
          <button className="btn-book-now" onClick={handleBookNow}>Book Now</button>
          <Link to={localStorage.getItem("token") ? "/profile" : "/login"}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <FaUser className="user-icon" />
              {userName && <span className="user-name">{userName}</span>}
            </span>
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
          <button className="btn-book-now" onClick={() => {toggleMobileMenu(); handleBookNow();}}>
            Book Now
          </button>

          {/* Sign In / Register or Profile Link */}
          <div className="navbar-signin">
            {localStorage.getItem("token") ? (
              <Link to="/profile" onClick={toggleMobileMenu}>
                <FaUser /> {userName && <span className="user-name">{userName}</span>}
              </Link>
            ) : (
              <Link to="/login" onClick={toggleMobileMenu}>
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;