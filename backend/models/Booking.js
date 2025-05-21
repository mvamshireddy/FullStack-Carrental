const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // allow guest bookings
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: false }, // allow static cars
  staticCar: { // details for static car bookings
    id: Number,
    name: String,
    price: Number,
    image: String,
    passengers: Number,
    luggage: Number,
    category: String,
    description: String
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  referenceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);