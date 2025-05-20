const express = require('express');
const router = express.Router();
const { 
  processPayment, 
  getPayment, 
  getUserPayments 
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Protected routes
router.post('/', protect, processPayment);
router.get('/user', protect, getUserPayments);
router.get('/:id', protect, getPayment);

module.exports = router;