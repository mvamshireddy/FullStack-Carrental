const Car = require('../models/Car');

// Get all cars
exports.getCars = async (req, res) => {
  try {
    // Query parameters for filtering
    const { brand, type, priceMin, priceMax, transmission, fuelType, location } = req.query;
    
    // Build query
    const query = {};
    
    if (brand) query.brand = brand;
    if (type) query.type = type;
    if (transmission) query.transmission = transmission;
    if (fuelType) query.fuelType = fuelType;
    if (location) query.location = location;
    
    // Price range
    if (priceMin || priceMax) {
      query.pricePerDay = {};
      if (priceMin) query.pricePerDay.$gte = Number(priceMin);
      if (priceMax) query.pricePerDay.$lte = Number(priceMax);
    }
    
    // Get all cars based on filter
    const cars = await Car.find(query);
    
    res.status(200).json({
      success: true,
      count: cars.length,
      data: cars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cars',
      error: error.message
    });
  }
};

// Get single car
exports.getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching car',
      error: error.message
    });
  }
};

// Create new car
exports.createCar = async (req, res) => {
  try {
    // Handle image paths if files were uploaded
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/cars/${file.filename}`);
    }
    
    const car = await Car.create(req.body);
    
    res.status(201).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating car',
      error: error.message
    });
  }
};

// Update car
exports.updateCar = async (req, res) => {
  try {
    // Handle image paths if files were uploaded
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => `/uploads/cars/${file.filename}`);
    }
    
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: car
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating car',
      error: error.message
    });
  }
};

// Delete car
exports.deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Car deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting car',
      error: error.message
    });
  }
};