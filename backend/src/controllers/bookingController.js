const Booking = require('../models/Booking');
const Car = require('../models/Car');
const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

// Create new booking with complete details
exports.createBooking = async (req, res) => {
  try {
    const { 
      carId, 
      startDate, 
      endDate, 
      pickupLocation, 
      dropoffLocation, 
      paymentMethod,
      userDetails,
      paymentDetails,
      additionalServices = []
    } = req.body;
    
    // Check if car exists and is available
    const car = await Car.findById(carId);
    
    if (!car) {
      return res.status(404).json({
        success: false,
        message: 'Car not found'
      });
    }
    
    if (!car.available) {
      return res.status(400).json({
        success: false,
        message: 'Car is not available for booking'
      });
    }
    
    // Calculate total days and amount
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (totalDays < 1) {
      return res.status(400).json({
        success: false,
        message: 'Booking must be for at least 1 day'
      });
    }
    
    // Calculate base price
    let totalAmount = totalDays * car.pricePerDay;
    
    // Add additional services cost
    if (additionalServices && additionalServices.length > 0) {
      const additionalServicesCost = additionalServices.reduce(
        (total, service) => total + service.price, 0
      );
      totalAmount += additionalServicesCost;
    }
    
    // Generate unique booking reference with timestamp
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
    const bookingReference = `CARR-${timestamp}-${uuidv4().substring(0, 4).toUpperCase()}`;
    
    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      car: carId,
      startDate,
      endDate,
      totalDays,
      pickupLocation,
      dropoffLocation,
      totalAmount,
      paymentMethod,
      bookingReference,
      additionalServices,
      status: 'pending',
      paymentStatus: 'pending'
    });
    
    // If payment details are provided, process payment immediately
    if (paymentDetails) {
      // Create payment record
      const payment = await Payment.create({
        booking: booking._id,
        user: req.user.id,
        amount: totalAmount,
        paymentMethod,
        status: 'completed', // In a real app, this would depend on payment gateway response
        paymentId: `PAY-${Date.now()}`,
        transactionDetails: paymentDetails
      });
      
      // Update booking payment status
      booking.paymentStatus = 'completed';
      booking.paymentId = payment.paymentId;
      booking.status = 'confirmed';
      
      await booking.save();
      
      // Update car availability
      await Car.findByIdAndUpdate(carId, { available: false });
    }
    
    // Populate the car details in the response
    const populatedBooking = await Booking.findById(booking._id).populate('car');
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: populatedBooking
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get booking details with reference ID
exports.getBookingByReference = async (req, res) => {
  try {
    const { reference } = req.params;
    
    const booking = await Booking.findOne({ bookingReference: reference })
      .populate('car')
      .populate('user', 'name email phone');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};
