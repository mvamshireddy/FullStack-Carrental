const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  referenceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);