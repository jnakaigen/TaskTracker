const Project = require('../models/projectModel');
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

// GET a single project (now using pid instead of id)
const getProject = async (req, res) => {
    const { pid } = req.params;  // Changed from id to pid
    const project = await Project.findOne({ pid });  // Changed from findById to findOne({ pid })
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json(project);
}

// Create a new project (id now refers to User, pid is the project ID)
const createProject = async (req, res) => {
    const { pid, id, title, status, startDate, dueDate, tasks } = req.body;  // Swapped order
    try {
        const project = await Project.create({ pid, id, title, status, startDate, dueDate, tasks });
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a project (now using pid instead of id)
const deleteProject = async (req, res) => {
    const { pid } = req.params;  // Changed from id to pid
    const project = await Project.findOneAndDelete({ pid });  // Changed from _id to pid
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.status(200).json({ message: 'Project deleted successfully' });
}

// Update a project (now using pid instead of id)
const updateProject = async (req, res) => {
    try {
        const { pid } = req.params;  // Changed from id to pid
        const project = await Project.findOneAndUpdate(
            { pid },  // Changed from _id to pid
            { ...req.body },
            { new: true }
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