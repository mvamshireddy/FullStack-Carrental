const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { 
  createBooking, 
  getUserBookings, 
  getBooking, 
  updateBookingStatus, 
  cancelBooking,
  getBookingByReference
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Booking validation middleware
const validateBookingInput = [
  body('carId').isMongoId().withMessage('Valid car ID is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      return true;
    }),
  body('endDate').isISO8601().withMessage('Valid end date is required')
    .custom((value, { req }) => {
      const endDate = new Date(value);
      const startDate = new Date(req.body.startDate);
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('pickupLocation').notEmpty().withMessage('Pickup location is required'),
  body('dropoffLocation').notEmpty().withMessage('Drop-off location is required'),
  body('paymentMethod').isIn(['upi', 'card', 'bank_transfer'])
    .withMessage('Invalid payment method'),
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

// Protected routes for all authenticated users
router.post('/', protect, validateBookingInput, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.post('/:id/cancel', protect, cancelBooking);

// Public route for checking booking by reference
router.get('/reference/:reference', getBookingByReference);

// Protected admin routes
router.put('/:id/status', protect, authorize('admin'), updateBookingStatus);

module.exports = router;