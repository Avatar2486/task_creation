const Joi = require('joi');

// Generic validation middleware
exports.validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors
            });
        }

        next();
    };
};

// User registration validation schema
exports.registerSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Name is required',
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 255 characters'
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
    password: Joi.string()
        .min(6)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long'
        }),
    role: Joi.string()
        .valid('user', 'admin')
        .optional()
});

// User login validation schema
exports.loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address'
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required'
        })
});

// Task creation validation schema
exports.createTaskSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.empty': 'Title is required',
            'string.max': 'Title must not exceed 255 characters'
        }),
    description: Joi.string()
        .max(5000)
        .allow('', null)
        .optional()
        .messages({
            'string.max': 'Description must not exceed 5000 characters'
        }),
    status: Joi.string()
        .valid('pending', 'in_progress', 'completed')
        .optional()
        .messages({
            'any.only': 'Status must be one of: pending, in_progress, completed'
        }),
    due_date: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            'date.format': 'Due date must be a valid ISO date'
        })
});

// Task update validation schema
exports.updateTaskSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(255)
        .optional()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.max': 'Title must not exceed 255 characters'
        }),
    description: Joi.string()
        .max(5000)
        .allow('', null)
        .optional()
        .messages({
            'string.max': 'Description must not exceed 5000 characters'
        }),
    status: Joi.string()
        .valid('pending', 'in_progress', 'completed')
        .optional()
        .messages({
            'any.only': 'Status must be one of: pending, in_progress, completed'
        }),
    due_date: Joi.date()
        .iso()
        .allow(null)
        .optional()
        .messages({
            'date.format': 'Due date must be a valid ISO date'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Profile update validation schema
exports.updateProfileSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(255)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name must not exceed 255 characters'
        }),
    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'Email must be a valid email address'
        }),
    password: Joi.string()
        .min(6)
        .optional()
        .messages({
            'string.min': 'Password must be at least 6 characters long'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});
