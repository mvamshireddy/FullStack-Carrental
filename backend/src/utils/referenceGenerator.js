const { v4: uuidv4 } = require('uuid');

/**
 * Generate a unique booking reference
 * @returns {String} Booking reference
 */
exports.generateBookingReference = () => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').substring(0, 14);
  return `CARR-${timestamp}-${uuidv4().substring(0, 4).toUpperCase()}`;
};

/**
 * Generate a unique payment reference
 * @returns {String} Payment reference
 */
exports.generatePaymentReference = () => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
  return `PAY-${timestamp}-${Math.floor(Math.random() * 1000)}`;
};