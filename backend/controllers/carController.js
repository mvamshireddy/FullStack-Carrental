const Car = require('../models/Car');

// Add new car (Admin)
exports.addCar = async (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  try {
    const car = new Car(req.body);
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add car', error: err.message });
  }
};

// Remove car (Admin)
exports.removeCar = async (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  try {
    await Car.findByIdAndDelete(req.params.id);
    res.json({ message: 'Car removed' });
  } catch (err) {
    res.status(404).json({ message: 'Car not found', error: err.message });
  }
};

// Get all cars
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cars', error: err.message });
  }
};

// Update car (Admin)
exports.updateCar = async (req, res) => {
  if (!req.user || !req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(car);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update car', error: err.message });
  }
};