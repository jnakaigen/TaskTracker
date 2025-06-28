const express = require('express')
 
const router = express.Router()

//GET all tasks
router.get('/', (req, res) => {
    res.json({ mssg: 'GET all tasks' })
})

//GET a single task
router.get('/:id', (req, res) => {
    res.json({ mssg: 'GET a single task' })
})

//POST a new task
router.post('/', (req, res) => { 
    res.json({ mssg: 'POST a new task' })
})

//DELETE a task
router.delete('/:id', (req, res) => {
    res.json({ mssg: 'DELETE a task' })
})

//UPDATE a task
router.patch('/:id', (req, res) => {
    res.json({ mssg: 'UPDATE a task' })
})

module.exports = router