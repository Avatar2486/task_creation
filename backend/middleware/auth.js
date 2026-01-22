const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// middleware to protect routes that require authentication
exports.protect = async (req, res, next) => {
    try {
        let token;

        // also tried getting token from cookies but header approach is cleaner
        // if (req.cookies && req.cookies.token) {
        //     token = req.cookies.token;
        // }

        // get token from authorization header
        // format: Bearer <token>
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            // console.log('No token provided');
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please provide a valid token.'
            });
        }

        try {
            // verify jwt token
            const decoded = User.verifyToken(token);

            // initially fetched full user from db but this was slower
            // const user = await User.findById(decoded.id);
            // req.user = user;

            // add user info to request object so other middleware/controllers can use it
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };

            next();
        } catch (error) {
            // token verification failed
            // console.log('Token verification failed:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    } catch (error) {
        next(error);
    }
};

// middleware to restrict access based on user role
// usage: authorize('admin', 'manager')
exports.authorize = (...roles) => {
    return (req, res, next) => {
        // check if user's role is in the allowed roles array
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};
