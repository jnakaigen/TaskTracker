//3rd step=>setup env file
require('dotenv').config()

//5th step=>import routes 
const tasksRoutes = require('./routes/tasks')

//7th step=> import mongoose for database connection
const mongoose = require('mongoose')

//1st step=>message visible in terminal
const express=require('express') 
const app=express() //express app
/*app.listen(4000,()=>{
    console.log("Listening on port 4000")
})*/

//6th step
app.use(express.json())

//4th step=>when req send in postman,terminal will show the request path and method
app.use((req, res, next) => {
    console.log(req.path, req.method); 
    next() // Call the next middleware or route handler
})
//5th step=>use tasks routes
app.use('/api/tasks',tasksRoutes)

//2nd step=>message visible in browser(route)
/*app.get('/',(req,res)=>{//this is a middleware function,req=>request object,res=>response object
    res.json({
        message: "Hello from the server!"
    })
})*/

//7th step=>connect to mongodb
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{//once we connect to db, we start listening on port
        app.listen(process.env.PORT,()=>{
        console.log(`Connected to db and Listening on port ${process.env.PORT}`)
        })
    }) 
    .catch((error)=>{
        console.log(error)
    })


//3rd step=>setup env file to protect port number
process.env.PORT=4000
/*app.listen(process.env.PORT,()=>{
    console.log(`Listening on port ${process.env.PORT}`)
}) */