import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Information */}
        <div className="footer-section">
          <h4 className="footer-heading">Shadow Drive</h4>
          <p className="footer-description">
            Providing premium transportation services with a focus on luxury, reliability, and exceptional customer experiences.
          </p>
          <div className="footer-social">
            <FaFacebookF className="social-icon" />
            <FaInstagram className="social-icon" />
            <FaTwitter className="social-icon" />
            <FaLinkedinIn className="social-icon" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/vehicles">Our Vehicles</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        {/* Our Services */}
        <div className="footer-section">
          <h4 className="footer-heading">Our Services</h4>
          <ul className="footer-links">
            <li><a href="/services/airport-transfers">Airport Transfers</a></li>
            <li><a href="/services/corporate-travel">Corporate Travel</a></li>
            <li><a href="/services/event-transportation">Event Transportation</a></li>
            <li><a href="/services/wedding-service">Wedding Service</a></li>
            <li><a href="/services/hourly-chauffeur">Hourly Chauffeur</a></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div className="footer-section">
          <h4 className="footer-heading">Contact Us</h4>
          <ul className="footer-contact">
            <li><MdLocationOn className="contact-icon" /> 123 Executive Drive, Finance District, New York, NY 10001</li>
            <li><MdPhone className="contact-icon" /> +1 (555) 123-4567</li>
            <li><MdEmail className="contact-icon" /> info@shadowdrive.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>&copy; 2025 Shadow Drive. All rights reserved.</p>
        <ul className="footer-bottom-links">
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/faq">FAQ</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;