const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validate, createTaskSchema, updateTaskSchema } = require('../middleware/validation');

// All task routes require authentication
router.use(protect);

// Task routes
router.get('/tasks', taskController.getTasks);
router.get('/tasks/:id', taskController.getTask);
router.post('/tasks', validate(createTaskSchema), taskController.createTask);
router.put('/tasks/:id', validate(updateTaskSchema), taskController.updateTask);
router.delete('/tasks/:id', taskController.deleteTask);

module.exports = router;
