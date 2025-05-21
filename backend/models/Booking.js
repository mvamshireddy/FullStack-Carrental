const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: false }, // backend car
  staticCar: { // for static/frontend cars
    id: Number,
    name: String,
    image: String,
    description: String,
    price: Number,
    passengers: Number,
    luggage: Number,
    category: String
  },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  referenceId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'cancelled', 'completed'], default: 'active' },
  paymentIntentId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);