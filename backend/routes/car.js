const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const auth = require('../middleware/auth');

// Public: Get all cars
router.get('/', carController.getAllCars);

// Admin: Add, update, or remove cars
router.post('/', auth, carController.addCar);
router.put('/:id', auth, carController.updateCar);
router.delete('/:id', auth, carController.removeCar);

module.exports = router;