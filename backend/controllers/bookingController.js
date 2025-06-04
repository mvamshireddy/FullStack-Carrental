require('dotenv').config();
const Booking = require('../models/Booking');
const { v4: uuidv4 } = require('uuid');
const { sendBookingConfirmationMail } = require('../utils/mailer');

// Helper: Check for overlapping bookings (backend cars only)
async function isCarAvailable(carId, startTime, endTime) {
  const overlap = await Booking.findOne({
    car: carId,
    status: { $in: ['active', 'confirmed'] },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
    ]
  });
  return !overlap;
}

// POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const userId = req.user.userId;
    let {
      car,
      carType,
      carDetails,
      startTime,
      endTime,
      pickupLocation,
      dropoffLocation,
      referenceId,
      status,
      paymentIntentId,
      contactDetails
    } = req.body;

    // Validation...
    if (!carType) return res.status(400).json({ message: "carType required." });
    if (carType === "backend" && !car)
      return res.status(400).json({ message: "Backend car id required." });
    if (carType === "static" && !carDetails)
      return res.status(400).json({ message: "Static car details required." });

    if (!startTime || !endTime)
      return res.status(400).json({ message: "Start and end times required." });
    if (!pickupLocation || !dropoffLocation)
      return res.status(400).json({ message: "Pickup and dropoff locations required." });

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start) || isNaN(end))
      return res.status(400).json({ message: "Invalid dates provided." });
    if (start < new Date())
      return res.status(400).json({ message: "Start time cannot be in the past." });
    if (end <= start)
      return res.status(400).json({ message: "End time must be after start time." });

    if (carType === "backend" && car) {
      const available = await isCarAvailable(car, start, end);
      if (!available) return res.status(409).json({ message: "Car is not available for the selected dates." });
    }

    if (!referenceId) referenceId = uuidv4();

    const booking = new Booking({
      user: userId,
      car: carType === "backend" ? car : undefined,
      staticCar: carType === "static" ? carDetails : undefined,
      startTime: start,
      endTime: end,
      pickupLocation,
      dropoffLocation,
      referenceId,
      status: status || 'active',
      paymentIntentId,
      contactDetails
    });

    await booking.save();

    // Send confirmation email if email is present
    if (booking.contactDetails && booking.contactDetails.email) {
      sendBookingConfirmationMail(booking.contactDetails.email, booking).catch(e => {
        console.error('Booking confirmation email failed:', e.message);
      });
    }

    res.status(201).json({ message: 'Booking created', booking });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};

// GET /api/bookings/:referenceId
exports.getBookingByReferenceId = async (req, res) => {
  try {
    const booking = await Booking.findOne({ referenceId: req.params.referenceId });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
