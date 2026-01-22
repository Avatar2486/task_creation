const User = require('../models/userModel');

// handle user registration
exports.register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // check if user already exists
        // const existingUser = await User.findByEmail(email);
        // if (existingUser) {
        //     return res.status(400).json({ success: false, message: 'User already exists' });
        // }

        // create new user in database
        const user = await User.create({ name, email, password });

        // generate jwt token for the user
        const token = User.generateToken(user.id, user.email, user.role);

        // send response with user data and token
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        // console.log('Registration error:', error);
        next(error); // pass to error handler middleware
    }
};

// login user
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // console.log('Login attempt for:', email);

        // find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            // dont tell them if email doesnt exist for security
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // check password
        const isPasswordValid = await User.comparePassword(password, user.password);
        if (!isPasswordValid) {
            // console.log('Invalid password for user:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // create jwt token
        const token = User.generateToken(user.id, user.email, user.role);

        // old response format
        // res.status(200).json({ token, user });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

// get current user profile
exports.getProfile = async (req, res, next) => {
    try {
        // req.user is set by protect middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// update user profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const updates = {};

        // only update fields that are provided
        if (name) updates.name = name;
        if (email) updates.email = email;
        if (password) updates.password = password;

        const user = await User.updateUser(req.user.id, updates);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// admin only - get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.getAllUsers();

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        next(error);
    }
};

// admin only - delete user by id
exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const user = await User.deleteUser(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
