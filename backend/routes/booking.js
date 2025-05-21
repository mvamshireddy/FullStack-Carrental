const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// POST /api/bookings
router.post('/', async (req, res) => {
  try {
    const {
      user, car, staticCar, startTime, endTime,
      pickupLocation, dropoffLocation, referenceId, status
    } = req.body;

    // Accept booking for DB or static car
    if (!car && !staticCar) {
      return res.status(400).json({ message: "Car ID or staticCar info required." });
    }

    const booking = new Booking({
      user, car, staticCar, startTime, endTime,
      pickupLocation, dropoffLocation, referenceId, status
    });

    await booking.save();
    res.status(201).json({ message: 'Booking created', booking });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;