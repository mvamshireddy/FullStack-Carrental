const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'End date is required']
  },
  totalDays: {
    type: Number,
    required: true
  },
  pickupLocation: {
    type: String,
    required: [true, 'Pickup location is required']
  },
  dropoffLocation: {
    type: String,
    required: [true, 'Dropoff location is required']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'bank_transfer'],
    required: true
  },
  paymentId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'],
    default: 'pending'
  },
  bookingReference: {
    type: String,
    required: true,
    unique: true
  },
  additionalServices: [{
    name: String,
    price: Number
  }],
  // Additional details
  customerDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    drivingLicense: String
  },
  bookingNotes: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  // For tracking changes
  bookingHistory: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String
  }]
}, {
  timestamps: true
});

// Add method to track status changes
bookingSchema.methods.updateStatus = function(status, note) {
  this.status = status;
  this.bookingHistory.push({
    status,
    note,
    timestamp: new Date()
  });
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);