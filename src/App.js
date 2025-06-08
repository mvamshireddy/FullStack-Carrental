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
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import MyBookings from './pages/MyBookings';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'; // Make sure you have this page!
import { AuthProvider } from './context/AuthContext';
import ProfileMenu from './components/ProfileMenu';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <ProfileMenu />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/services" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booknow" element={<BookNow />} />
          <Route path="/confirmation/:bookingRef" element={<BookingConfirmation />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
export default App;