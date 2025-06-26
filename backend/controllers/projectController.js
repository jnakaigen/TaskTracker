const Project = require('../models/projectModel');
const mongoose = require('mongoose');

// GET all projects
const getProjects = async (req, res) => {
    const projects = await Project.find({}).sort({dueDate: 1});
    res.status(200).json(projects);
}

// GET a single project
const getProject = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'Invalid ID'});
    const project = await Project.findById(id);
    if (!project) return res.status(404).json({message: 'Project not found'});
    res.status(200).json(project);
}

// Create a new project
const createProject = async (req, res) => {
    const {id, title, status, startDate, dueDate, tasks} = req.body;
    console.log("Received body:", req.body); // <-- Add this
    try {
        const project = await Project.create({id, title, status, startDate, dueDate, tasks});
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// Delete a project
const deleteProject = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'Invalid ID'});
    const project = await Project.findOneAndDelete({_id: id});
    if (!project) return res.status(404).json({message: 'Project not found'});
    res.status(200).json({message: 'Project deleted successfully'});
}

// Update a project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'Invalid ID'});
        const project = await Project.findOneAndUpdate({_id: id}, {...req.body}, { new: true });
        if (!project) return res.status(404).json({message: 'Project not found'});
        res.status(200).json(project);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getProjects,
    getProject,
    createProject,
    deleteProject,
    updateProject
}