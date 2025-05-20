const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { 
  getCars, 
  getCar, 
  createCar, 
  updateCar, 
  deleteCar 
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Validation middleware
const validateCarInput = [
  body('name').notEmpty().withMessage('Car name is required').trim(),
  body('brand').notEmpty().withMessage('Car brand is required').trim(),
  body('model').notEmpty().withMessage('Car model is required').trim(),
  body('year').isInt({ min: 1950, max: new Date().getFullYear() + 1 })
    .withMessage(`Year must be between 1950 and ${new Date().getFullYear() + 1}`),
  body('type').isIn(['sedan', 'suv', 'hatchback', 'luxury', 'convertible'])
    .withMessage('Invalid car type'),
  body('transmission').optional().isIn(['automatic', 'manual'])
    .withMessage('Transmission must be either automatic or manual'),
  body('fuelType').isIn(['petrol', 'diesel', 'electric', 'hybrid'])
    .withMessage('Invalid fuel type'),
  body('pricePerDay').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('seatingCapacity').isInt({ min: 1, max: 10 })
    .withMessage('Seating capacity must be between 1 and 10'),
  body('location').notEmpty().withMessage('Car location is required'),
  // Add additional validations as needed
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Public routes
router.get('/', getCars);
router.get('/:id', getCar);

// Protected admin routes
router.post('/', protect, authorize('admin'), upload.array('images', 5), validateCarInput, createCar);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), validateCarInput, updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

module.exports = router;