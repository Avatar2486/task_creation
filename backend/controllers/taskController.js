const Task = require('../models/taskModel');

// get all tasks for logged in user
exports.getTasks = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // build filter object from query params
        const filters = {
            status: req.query.status,
            search: req.query.search,
            limit: parseInt(req.query.limit) || 10, // default 10 per page
            offset: parseInt(req.query.offset) || 0
        };

        // console.log('Fetching tasks for user:', userId, 'with filters:', filters);

        const tasks = await Task.getAllTasks(userId, filters);
        const total = await Task.getTaskCount(userId, { status: filters.status, search: filters.search });

        // tried this approach first but pagination was better
        // const tasks = await Task.getAllTasks(userId);
        // return res.status(200).json({ success: true, data: tasks });

        // return tasks with pagination info
        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
            pagination: {
                total,
                limit: filters.limit,
                offset: filters.offset,
                pages: Math.ceil(total / filters.limit)
            }
        });
    } catch (error) {
        // console.error('Error in getTasks:', error);
        next(error);
    }
};

// get single task by id
exports.getTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // check if task exists and belongs to user
        const task = await Task.getTaskById(id, userId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Not found Task or you do not have permission'
            });
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

// create new task
exports.createTask = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // validate title
        // if (!req.body.title || req.body.title.trim() === '') {
        //     return res.status(400).json({ success: false, message: 'Title is required' });
        // }

        // add user_id to task data
        const newTask = {
            ...req.body,
            user_id: userId
        };

        // console.log('Creating task:', newTask);

        const task = await Task.createTask(newTask);

        // tried returning just the task
        // res.status(201).json(task);

        res.status(201).json({
            success: true,
            data: task,
            message: 'Task created successfully'
        });
    } catch (error) {
        next(error);
    }
};

// update existing task
exports.updateTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // check if task exists first
        // const existingTask = await Task.getTaskById(id, userId);
        // if (!existingTask) {
        //     return res.status(404).json({ success: false, message: 'Task not found' });
        // }

        // only update if task belongs to user
        const updatedTask = await Task.updateTask(id, userId, req.body);

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or you do not have permission to update it'
            });
        }

        // console.log('Task updated:', id);

        res.status(200).json({
            success: true,
            data: updatedTask,
            message: 'Task updated successfully'
        });
    } catch (error) {
        next(error);
    }
};

// delete task
exports.deleteTask = async (req, res, next) => {
    try {
        const id = req.params.id;
        const userId = req.user.id;

        // verify ownership before deleting
        const deletedTask = await Task.deleteTask(id, userId);

        if (!deletedTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or you do not have permission to delete it'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

