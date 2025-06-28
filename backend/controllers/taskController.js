const Task = require('../models/taskModel');
const mongoose = require('mongoose');


// GET all tasks (with filtering options)
const getTasks = async (req, res) => {
    try {
        const { project, assignedTo, status } = req.query;
        
        // Build filter object based on query parameters
        const filter = {};
        if (project) filter.project = project;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (status) filter.status = status;

        const tasks = await Task.find(filter).sort({ dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// GET a single task
const getTask = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid ID' });
    }

    try {
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create a new task
const createTask = async (req, res) => {
    console.log('Task create request:', req.body);
    const { title, description, dueDate, assignedTo, project, status } = req.body;

    if (!title || !dueDate || !project) {
        return res.status(400).json({ error: 'Title, due date, and project are required' });
    }

    try {

        const task = await Task.create({ 
            title, 
            description, 
            dueDate, 
            assignedTo, 
            project, 
            status: status || 'To Do'
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid ID' });
    }

    try {
        const task = await Task.findOneAndDelete({ _id: id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ 
            message: 'Task deleted successfully',
            deletedTask: task // Return the deleted task for potential undo functionality
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid ID' });
    }

    try {
        const task = await Task.findOneAndUpdate(
            { _id: id }, 
            { ...req.body },
            { new: true, runValidators: true } // Return updated doc and validate updates
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask
}