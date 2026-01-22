// Custom error class
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error('Error:', err);

    // Mongoose/PostgreSQL duplicate key error
    if (err.code === '23505') {
        const message = 'Duplicate field value entered';
        error = new AppError(message, 400);
    }

    // Mongoose/PostgreSQL validation error
    if (err.code === '23502') {
        const message = 'Required field is missing';
        error = new AppError(message, 400);
    }

    // PostgreSQL foreign key violation
    if (err.code === '23503') {
        const message = 'Referenced resource does not exist';
        error = new AppError(message, 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new AppError(message, 401);
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new AppError(message, 401);
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(e => e.message).join(', ');
        error = new AppError(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

// Not found middleware
const notFound = (req, res, next) => {
    const error = new AppError(`Route not found - ${req.originalUrl}`, 404);
    next(error);
};

module.exports = { errorHandler, notFound, AppError };
