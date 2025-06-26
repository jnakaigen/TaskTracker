const express = require('express');
const router = express.Router();
//2nd step
const Project = require('../models/projectModel');
//3rd step=>importing taskController
const{createProject,getProjects,getProject,deleteProject,updateProject}=require('../controllers/projectController')

//GET all tasks
router.get('/',getProjects)
//GET a single task
router.get('/:id',getProject)
//POST a new workout

/* router.post('/',(req,res)=>{
    res.json({message: "POST a new workout"})
})*/
/*router.post('/',async(req,res)=>{//made it async in the 2nd step
    //2nd step=>
    const{title,description,dueDate,status,priority} = req.body;
    try{const task=await Task.create({title,description,dueDate,status,priority})
    res.status(200).json(task)}
    catch(error){res.status(400).json({error:error.message})}
    //res.json({message:"POST a new workout"}) no longer needed in the 2nd step  
})*/
router.post('/',createProject)

//DELETE a new workout
router.delete('/:id',deleteProject)
//UPDATE a workout
router.put('/:id',updateProject)
router.patch('/:id',updateProject)

module.exports = router;
