// Load environment variables
require('dotenv').config();

// Import packages
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const tasksRoutes = require('./routes/tasks');
const teamsRoutes = require('./routes/teams');
const projectsRoutes = require('./routes/projects');

// Create express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Route handling
app.use('/api/tasks', tasksRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/projects', projectsRoutes);

// Default port fallback
const PORT = process.env.PORT || 4000;

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Connected to DB and listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ DB connection error:', error);
  });
