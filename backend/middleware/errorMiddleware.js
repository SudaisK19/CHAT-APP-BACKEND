// middleware/errorMiddleware.js

// 404 handler — catches any route not matched above
const notFound = (req, res, next) => {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
  };
  
  // General error handler — catches any error passed to next(err)
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
      message: err.message,
      // Only show stack in non-production
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  };
  
  module.exports = { notFound, errorHandler };
  