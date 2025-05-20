const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Car name is required'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Car brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Car model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required']
  },
  type: {
    type: String,
    enum: ['sedan', 'suv', 'hatchback', 'luxury', 'convertible'],
    required: [true, 'Car type is required']
  },
  transmission: {
    type: String,
    enum: ['automatic', 'manual'],
    default: 'automatic'
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel', 'electric', 'hybrid'],
    required: [true, 'Fuel type is required']
  },
  pricePerDay: {
    type: Number,
    required: [true, 'Price per day is required']
  },
  description: {
    type: String,
    required: [true, 'Car description is required']
  },
  features: [String],
  images: [String],
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required']
  },
  available: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    required: [true, 'Car location is required']
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  numberOfReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema);