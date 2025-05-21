const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: false },
  staticCar: { /* ...same as before... */ },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  referenceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  paymentIntentId: { type: String }, // Stripe or similar payment ref
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);