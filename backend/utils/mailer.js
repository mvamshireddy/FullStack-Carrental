require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

// Welcome email (registration)
exports.sendWelcomeMail = async (to, name) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Welcome to ShadowCars!',
    html: `<h2>Hello ${name},</h2><p>Thank you for registering with us!</p>`
  };
  return transporter.sendMail(mailOptions);
};

// Login notification
exports.sendLoginMail = async (to, name, loginTime = new Date()) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: 'Login Alert - ShadowCars',
    html: `<h2>Hello ${name},</h2>
      <p>Your account was just logged in at <b>${loginTime.toLocaleString()}</b>.</p>
      <p>If this wasn't you, please reset your password immediately.</p>`
  };
  return transporter.sendMail(mailOptions);
};

// Booking confirmation email
exports.sendBookingConfirmationMail = async (to, booking) => {
  const car = booking.car || booking.staticCar || {};
  const contact = booking.contactDetails || {};
  const duration = Math.max(1, Math.ceil((new Date(booking.endTime) - new Date(booking.startTime)) / (1000 * 60 * 60)));
  const rentalCost = car.price && duration ? car.price * duration : '-';
  const serviceFee = booking.serviceFee || 25;
  const totalCost = booking.totalCost || (Number(rentalCost) + Number(serviceFee));
  const formatDate = (dateString) =>
    dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-';
  const formatTime = (dateString) =>
    dateString ? new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-';

  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject: `Booking Confirmed - Reference ${booking.referenceId}`,
    html: `
      <h2>Booking Confirmed!</h2>
      <p>Thank you for your booking. Your reservation has been successfully confirmed.</p>
      <h3>Booking Reference: ${booking.referenceId}</h3>
      <h4>Booking Summary</h4>
      <ul>
        <li><b>Car:</b> ${car.name || '-'} (${car.category || '-'})</li>
        <li><b>Booking Date:</b> ${formatDate(booking.createdAt)}</li>
        <li><b>Customer:</b> ${contact.fullName || '-'}</li>
        <li><b>Email:</b> ${contact.email || '-'}</li>
        <li><b>Phone:</b> ${contact.phoneNumber || '-'}</li>
        <li><b>Pickup Date:</b> ${formatDate(booking.startTime)}</li>
        <li><b>Pickup Time:</b> ${formatTime(booking.startTime)}</li>
        <li><b>Pickup Location:</b> ${booking.pickupLocation || '-'}</li>
        <li><b>Dropoff Location:</b> ${booking.dropoffLocation || '-'}</li>
        <li><b>Duration:</b> ${duration} hours</li>
        <li><b>Payment Method:</b> Credit Card</li>
      </ul>
      <h4>Price Details</h4>
      <ul>
        <li>Rental Cost: $${rentalCost}</li>
        <li>Service Fee: $${serviceFee}</li>
        <li><b>Total Paid: $${totalCost}</b></li>
      </ul>
      <p>For any queries, please contact our support team.</p>
    `
  };
  return transporter.sendMail(mailOptions);
};
