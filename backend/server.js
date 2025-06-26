require('dotenv').config();

// Import routes
const tasksRoutes = require('./routes/tasks');
const teamsRoutes = require('./routes/teams');

// Import mongoose for database connection
const mongoose = require('mongoose');

// Express app setup
const express = require('express');
const app = express();

// Enable CORS and JSON parsing
const cors = require('cors');
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(req.path, req.method); 
    next();
});

// Use routes
app.use('/api/tasks', tasksRoutes);
app.use('/api/teams', teamsRoutes);

// Set default port if not in .env
const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Connected to db and Listening on port ${PORT}`);
        });
    }) 
    .catch((error) => {
        console.log(error);
    });