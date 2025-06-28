require('dotenv').config()

const express = require('express')
const taskRoutes = require('./routes/task')

//express app 
const app = express()

//middleware
app.use(express.json())

 app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

//routes
app.use('/api/task', taskRoutes)

//listening for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port', process.env.PORT)
})
