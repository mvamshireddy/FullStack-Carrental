const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

// Process payment
exports.processPayment = async (req, res) => {
  try {
    const { 
      bookingId, 
      paymentMethod, 
      transactionDetails,
      // Additional payment details based on method
      upiDetails,
      cardDetails,
      bankDetails
    } = req.body;
    
    // Check if booking exists
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this booking'
      });
    }
    
    // Check if payment already completed
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this booking'
      });
    }
    
    // Prepare payment data based on method
    let paymentData = {
      transactionDetails: transactionDetails || {}
    };
    
    switch (paymentMethod) {
      case 'upi':
        paymentData.transactionDetails.upi = upiDetails;
        break;
      case 'card':
        // In a real app, you'd never store full card details
        // Only store last 4 digits or a token from payment processor
        if (cardDetails) {
          paymentData.transactionDetails.card = {
            lastFour: cardDetails.number ? cardDetails.number.slice(-4) : null,
            expiryMonth: cardDetails.expiryMonth,
            expiryYear: cardDetails.expiryYear,
            cardType: cardDetails.cardType
          };
        }
        break;
      case 'bank_transfer':
        paymentData.transactionDetails.bank = bankDetails;
        break;
      default:
        break;
    }
    
    // In a real app, you would integrate with payment gateway here
    // For now we simulate a successful payment
    
    // Create payment record with timestamp and reference
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
    const paymentId = `PAY-${timestamp}-${Math.floor(Math.random() * 1000)}`;
    
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: booking.totalAmount,
      paymentMethod,
      status: 'completed',
      paymentId,
      transactionDetails: paymentData.transactionDetails
    });
    
    // Update booking payment status
    booking.paymentStatus = 'completed';
    booking.paymentId = payment.paymentId;
    booking.status = 'confirmed';
    
    await booking.save();
    
    // Update car availability
    await Car.findByIdAndUpdate(booking.car, { available: false });
    
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: {
        payment,
        booking
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing payment',
      error: error.message
    });
  }
};

// Other payment controller methods remain the same...