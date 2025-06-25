const Task = require('../models/taskModel');
const mongoose = require('mongoose');//2nd step

// GET all tasks
const getTasks = async (req, res) => {
    const tasks = await Task.find({}).sort({dueDate: 1});
    res.status(200).json(tasks);
}
// GET a single task
const getTask = async (req, res) => {
    const { id }=req.params; //get id from request params
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'Invalid ID'});//check if id is valid
    const task = await Task.findById(id);
    if(!task) return res.status(404).json({message: 'Task not found'});
    res.status(200).json(task);
}
// Create a new task

const createTask = async (req, res) => {
    const{title,description,dueDate,assignedTo,project,status} = req.body;
        try{//add new doc to db
            const task=await Task.create({title,description,dueDate,assignedTo,project,status}) 
            res.status(200).json(task)}
        catch(error){
            res.status(400).json({error:error.message})}
}

// Delete a task
const deleteTask = async (req, res) => {
    const { id }=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'Invalid ID'});
    const task = await Task.findOneAndDelete({_id: id});
    if(!task) return res.status(404).json({message: 'Task not found'});
    res.status(200).json({message: 'Task deleted successfully'});
}


// Update a task
const updateTask = async (req, res) => {
    try{const { id }=req.params;
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({message: 'Invalid ID'});
    const task = await Task.findOneAndUpdate({_id: id}, {...req.body},{ new: true });
    if(!task) return res.status(404).json({message: 'Task not found'});
    res.status(200).json(task);}
    catch(error){
        res.status(400).json({error:error.message})}
}


module.exports = {
    getTasks,
    getTask,
    createTask,
    deleteTask,
    updateTask
}