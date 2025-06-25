const express = require('express');
const router = express.Router();
//2nd step
const Task = require('../models/taskModel');
//3rd step=>importing taskController
const{createTask,getTasks,getTask,deleteTask,updateTask}=require('../controllers/taskController')

//GET all tasks
router.get('/',getTasks)
//GET a single task
router.get('/:id',getTask)
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
router.post('/',createTask)

//DELETE a new workout
router.delete('/:id',deleteTask)
//UPDATE a workout
router.put('/:id',updateTask)
router.patch('/:id',updateTask)

module.exports = router;
