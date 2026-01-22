const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const { validate, registerSchema, loginSchema, updateProfileSchema } = require('../middleware/validation');

// public routes - no auth required
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// protected routes - requires valid jwt token
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, validate(updateProfileSchema), authController.updateProfile);

// admin only routes
router.get('/users', protect, authorize('admin'), authController.getAllUsers);
router.delete('/users/:id', protect, authorize('admin'), authController.deleteUser);

module.exports = router;
