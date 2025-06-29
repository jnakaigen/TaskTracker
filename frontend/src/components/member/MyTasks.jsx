import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';

import {
  Box, Card, CardContent, Chip, Divider, FormControl, Grid,
  IconButton, MenuItem, Paper, Select, TextField, Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const statusColors = {
  'To Do': 'error',
  'In Progress': 'warning',
  'Done': 'success',
};

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [animateChart, setAnimateChart] = useState(false);
  const [projects, setProjects] = useState([]);


useEffect(() => {
  fetch('http://localhost:4000/api/projects')
    .then(res => res.json())
    .then(data => setProjects(Array.isArray(data) ? data : []))
    .catch(() => setProjects([]));
}, []);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    fetch(`http://localhost:4000/api/tasks?assignedTo=${user.id}`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(() => setTasks([]));
  }, []);

  useEffect(() => {
    setAnimateChart(true);
  }, []);

 const handleStatusChange = async (_id, newStatus) => {
  // Optimistically update UI
  setTasks(prev => prev.map(t => t._id === _id ? { ...t, status: newStatus } : t));

  // Send update to backend
  try {
    await fetch(`http://localhost:4000/api/tasks/${_id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    // Optionally, re-fetch tasks or handle errors
  } catch (err) {
    // Optionally, show error or revert optimistic update
    console.error('Failed to update status', err);
  }
};

  const handleCommentChange = (_id, newComment) => {
    setCommentInputs(prev => ({ ...prev, [_id]: newComment }));
  };

 const handleSaveComment = async (_id) => {
  if (!commentInputs[_id]) return;
  try {
    const res = await fetch(`http://localhost:4000/api/tasks/${_id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: commentInputs[_id] }),
    });
    if (!res.ok) throw new Error('Failed to save comment');
    const updatedTask = await res.json();
    setTasks(prev =>
      prev.map(t => t._id === _id ? updatedTask : t)
    );
    setCommentInputs(prev => ({ ...prev, [_id]: '' }));
  } catch (err) {
    console.error('Failed to save comment', err);
  }
};
  const getProjectName = (projectId) => {
  const project = projects.find(
    p => p.pid === projectId || p._id === projectId || String(p.pid) === String(projectId) || String(p._id) === String(projectId)
  );
  return project ? project.title : projectId;
};
  const grouped = tasks.reduce((acc, task) => {
    const projectName = getProjectName(task.project);
    if (!acc[projectName]) acc[projectName] = [];
    acc[projectName].push(task);
    return acc;
  }, {});

  const chartData = [
    { name: 'To Do', count: tasks.filter(t => t.status === 'To Do').length },
    { name: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length },
    { name: 'Done', count: tasks.filter(t => t.status === 'Done').length },
  ];

  const totalTasks = chartData.reduce((sum, d) => sum + d.count, 0);

  const pieColors = {
    'To Do': '#ef5350',
    'In Progress': '#ffca28',
    'Done': '#66bb6a'
  };

const [toDoDeg, inProgDeg, doneDeg] = chartData.map(d =>
  totalTasks ? (d.count / totalTasks) * 360 : 0
);

  return (
    <Box p={3} sx={{ background: 'linear-gradient(to right, #f5f7fa, #e8ecf3)', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight={700} mb={4} textAlign="center" color="primary.dark">Task Dashboard</Typography>

      <Box display="flex" justifyContent="center" mb={6}>
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            position: 'relative',
            background: `conic-gradient(
              ${pieColors['To Do']} 0deg ${animateChart ? toDoDeg : 0}deg,
              ${pieColors['In Progress']} ${animateChart ? toDoDeg : 0}deg ${animateChart ? toDoDeg + inProgDeg : 0}deg,
              ${pieColors['Done']} ${animateChart ? toDoDeg + inProgDeg : 0}deg 360deg
            )`,
            transition: 'background 2s ease-in-out',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: '#f5f7fa',
            }
          }}
        >
          <Box position="absolute" display="flex" flexDirection="column" alignItems="center">
           {chartData.map(({ name, count }) => (
  <Typography key={name} variant="caption" sx={{ color: pieColors[name], fontWeight: 600 }}>
    {name}: {totalTasks ? Math.round((count / totalTasks) * 100) : 0}%
  </Typography>
))}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          {Object.keys(grouped).map(projectName => (
            <Box key={projectName} mb={5}>
             <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
  {projectName.toUpperCase()}
</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {grouped[projectName].map(task => (
                  <Grid item xs={12} sm={6} md={4} key={task._id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, background: '#ffffff', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{task.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{task.description}</Typography>
                        <Chip label={task.status} color={statusColors[task.status]} size="small" sx={{ mb: 1 }} />
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <Select value={task.status} onChange={(e) => handleStatusChange(task._id, e.target.value)}>
                            <MenuItem value="To Do">To Do</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Due: {new Date(task.dueDate).toLocaleDateString("en-GB")}</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Add comment..."
                          value={commentInputs[task._id] || ''}
                          onChange={(e) => handleCommentChange(task._id, e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <IconButton onClick={() => handleSaveComment(task._id)} color="primary" size="small">
                          <SaveIcon />
                        </IconButton>
                        <Divider sx={{ my: 1 }} />
                        {(Array.isArray(task.comments) ? task.comments : []).map((c, i) => (
                          <Typography key={i} variant="body2" color="text.secondary">• {c}</Typography>
                        ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Box>
  );
}