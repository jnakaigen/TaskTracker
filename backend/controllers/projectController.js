const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const mongoose = require('mongoose');

// GET all projects
// GET all projects FOR A SPECIFIC USER
const getProjects = async (req, res) => {
    try {
        const { id } = req.query; // Get user ID from query params
        if (!id) return res.status(400).json({ message: 'User ID required' });
        
        const projects = await Project.find({ id }).sort({ dueDate: 1 });
        res.status(200).json(projects);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}

// GET a single project (using MongoDB _id)
const getProject = async (req, res) => {
    const { id } = req.params;  // Changed from pid to id
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID' });
    }
    
    try {
        const project = await Project.findById(id);  // Use MongoDB _id
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Create a new project (id now refers to User, pid is the project ID)
const createProject = async (req, res) => {
    const { pid, id, title, description, startDate, dueDate } = req.body;  // Swapped order
    try {
        const project = await Project.create({ pid, id, title, description, startDate, dueDate });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a project (now using id instead of pid)
const deleteProject = async (req, res) => {
    const { id } = req.params;  // Changed from pid to id to match route parameter
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid project ID' });
    }
    
    try {
        const project = await Project.findByIdAndDelete(id);  // Use MongoDB _id instead of pid
        if (!project) return res.status(404).json({ message: 'Project not found' });
         // Delete all tasks assigned to this project
          await Task.deleteMany({ assignedTo: id });
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Update a project (using MongoDB _id)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;  // Changed from pid to id
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ message: 'Invalid project ID' });
        }
        
        const project = await Project.findByIdAndUpdate(
            id,  // Use MongoDB _id
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
};
//END OF PROJECT CONTROLLER