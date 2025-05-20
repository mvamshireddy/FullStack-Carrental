/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Response data
 * @param {Number} statusCode - HTTP status code
 */
exports.success = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    timestamp: new Date().toISOString(),
    data
  });
};

/**
 * Standard error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Error} error - Error object
 * @param {Number} statusCode - HTTP status code
 */
exports.error = (res, message, error, statusCode = 400) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString()
  };
  
  // Include error details in development
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message;
    response.stack = error.stack;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Not found response
 * @param {Object} res - Express response object
 * @param {String} message - Not found message
 */
exports.notFound = (res, message = 'Resource not found') => {
  return res.status(404).json({
    success: false,
    message,
    timestamp: new Date().toISOString()
  });
};