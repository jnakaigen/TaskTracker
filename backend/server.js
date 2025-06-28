// 3rd step => setup env file
require('dotenv').config()

// 5th step => import routes 
const tasksRoutes = require('./routes/tasks');
const usersRoutes = require('./routes/users');
const teamsRoutes = require('./routes/teams');
const projectsRoutes = require('./routes/projects');

// 7th step => import mongoose for database connection
const mongoose = require('mongoose');

// 1st step => message visible in terminal
const express = require('express');
const app = express(); // express app

// const PORT = 4000;
const PORT = process.env.PORT || 4000; // Fallback if env not set

// 6th step
const cors = require('cors');
app.use(cors());
app.use(express.json());

// 4th step => when req sent in postman, terminal will show the request path and method
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next(); // Call the next middleware or route handler
});

// 5th step => use routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/users', usersRoutes);     // Add users routes
app.use('/api/teams', teamsRoutes);     // Add teams routes
app.use('/api/projects', projectsRoutes); // Add projects routes
app.use('/api/dashboard', require('./routes/dashboard'));

// 2nd step => message visible in browser (route)
/* app.get('/', (req, res) => {
  res.json({
    message: "Hello from the server!"
  });
}); */

// 7th step => connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Connected to DB and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ DB connection error:', error);
  });
