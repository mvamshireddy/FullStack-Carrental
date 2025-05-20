const Booking = require('../models/Booking');
const Car = require('../models/Car');
const { v4: uuidv4 } = require('uuid');

// Create a booking
exports.createBooking = async (req, res) => {
  try {
    const { carId, startTime, endTime, pickupLocation, dropoffLocation } = req.body;
    const userId = req.user.userId;

    // Optionally: check if car is available, dates are valid, etc.

    const referenceId = uuidv4();

    const booking = new Booking({
      user: userId,
      car: carId,
      startTime,
      endTime,
      pickupLocation,
      dropoffLocation,
      referenceId,
      status: 'active'
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Booking failed', error: err.message });
  }
};

// Get all bookings for a user (user or admin)
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.isAdmin;

    let bookings;
    if (isAdmin && req.query.all === 'true') {
      bookings = await Booking.find().populate('user').populate('car');
    } else {
      bookings = await Booking.find({ user: userId }).populate('car');
    }
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get bookings', error: err.message });
  }
};

// Cancel a booking (user or admin)
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Only the user or admin can cancel
    if (!req.user.isAdmin && String(booking.user) !== req.user.userId)
      return res.status(403).json({ message: 'Not authorized' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(400).json({ message: 'Cancel failed', error: err.message });
  }
};