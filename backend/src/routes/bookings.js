const express = require('express');
const router = express.Router();
const { 
  createBooking, 
  getUserBookings, 
  getBooking, 
  updateBookingStatus, 
  cancelBooking,
  getBookingByReference
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Protected routes for all authenticated users
router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.post('/:id/cancel', protect, cancelBooking);

// Public route for checking booking by reference
router.get('/reference/:reference', getBookingByReference);

// Protected admin routes
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;