const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const tasksFile = './tasks.json';

// Load tasks
const loadTasks = () => JSON.parse(fs.readFileSync(tasksFile, 'utf-8'));

// Save tasks
const saveTasks = (data) => fs.writeFileSync(tasksFile, JSON.stringify(data, null, 2));

// GET all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = loadTasks();
  res.json(tasks);
});

// PATCH: update task status
app.patch('/api/tasks/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = status;
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// POST: add comment to task
app.post('/api/tasks/:id/comment', (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.comments.push(comment);
    saveTasks(tasks);
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:4000`);
});
