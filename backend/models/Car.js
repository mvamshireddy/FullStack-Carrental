const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  image: { type: String },
  location: { type: String, required: true },
  availability: { type: Boolean, default: true },
  description: { type: String }
});

module.exports = mongoose.model('Car', carSchema);