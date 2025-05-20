import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Vehicles from './pages/Vehicles';
import Contact from './pages/Contact';
import BookNow from './pages/BookNow'; 
import BookingConfirmation from './pages/BookingConfirmation';
import LoginPage from './pages/LoginPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booknow" element={<BookNow />} /> {/* BookNow route */}
        <Route path="/confirmation/:bookingRef" element={<BookingConfirmation />} /> {/* Booking confirmation route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login route */}
      </Routes>
    </Router>
  );
}
export default App;