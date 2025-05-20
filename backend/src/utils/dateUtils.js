/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date to format
 * @returns {String} Formatted date
 */
exports.formatDate = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * Format timestamp to YYYY-MM-DD HH:MM:SS
 * @param {Date} date - Date to format
 * @returns {String} Formatted timestamp
 */
exports.formatTimestamp = (date) => {
  return date.toISOString().replace('T', ' ').substring(0, 19);
};

/**
 * Calculate duration between two dates in days
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Number} Duration in days
 */
exports.calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if a date is valid
 * @param {String} dateString - Date string to check
 * @returns {Boolean} Is valid date
 */
exports.isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};