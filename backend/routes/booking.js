const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');

// Create a booking (authenticated)
router.post('/', auth, bookingController.createBooking);

// Get bookings for user, or all (admin with ?all=true)
router.get('/', auth, bookingController.getUserBookings);

// Cancel a booking
router.delete('/:id', auth, bookingController.cancelBooking);

module.exports = router;