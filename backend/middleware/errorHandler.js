// Centralized error handling middleware
function errorHandler(err, req, res, next) {
  console.error('Unhandled Error:', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: message,
    // Only return stack trace in non-production environments
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
}

module.exports = errorHandler;
