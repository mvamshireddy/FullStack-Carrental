require('dotenv').config();
const { sendWelcomeMail, sendLoginMail, sendBookingConfirmationMail } = require('./utils/mailer');

sendWelcomeMail('mvamshireddy9848@gmail.com', 'Test User')
  .then(() => console.log('Welcome mail sent!'))
  .catch(e => console.error('Welcome mail failed:', e));

sendLoginMail('mvamshireddy9848@gmail.com', 'Test User')
  .then(() => console.log('Login mail sent!'))
  .catch(e => console.error('Login mail failed:', e));

// For booking, create a mock booking object as per your schema
const booking = {
  referenceId: "ABC123",
  createdAt: new Date(),
  car: { name: "Toyota", category: "Sedan", price: 100 },
  startTime: new Date(),
  endTime: new Date(Date.now() + 2 * 3600 * 1000),
  pickupLocation: "Airport",
  dropoffLocation: "Hotel",
  contactDetails: { email: "your@email.com", fullName: "Test User", phoneNumber: "1234567890" }
};
sendBookingConfirmationMail('mvamshireddy9848@gmail.com', booking)
  .then(() => console.log('Booking mail sent!'))
  .catch(e => console.error('Booking mail failed:', e));
  