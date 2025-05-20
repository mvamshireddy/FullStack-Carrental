const express = require('express');
const router = express.Router();
const { 
  getCars, 
  getCar, 
  createCar, 
  updateCar, 
  deleteCar 
} = require('../controllers/carController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getCars);
router.get('/:id', getCar);

// Protected admin routes
router.post('/', protect, authorize('admin'), upload.array('images', 5), createCar);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateCar);
router.delete('/:id', protect, authorize('admin'), deleteCar);

module.exports = router;