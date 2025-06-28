import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Chip, Divider, FormControl, Grid,
  IconButton, MenuItem, Paper, Select, TextField, Typography
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const initialTasks = [
  { id: 't1', title: 'Design Landing Page', description: 'Create a modern design for the new homepage.', dueDate: '2025-06-20', project: 'proj1', status: 'In Progress', comments: ['Mockups done. Need feedback from Alice.'] },
  { id: 't2', title: 'Setup Hosting', description: 'Set up the website on the new hosting platform.', dueDate: '2025-06-22', project: 'proj1', status: 'To Do', comments: [] },
  { id: 't3', title: 'Implement Mobile Navigation', description: 'Ensure responsive navigation for mobile users.', dueDate: '2025-06-25', project: 'proj1', status: 'Done', comments: ['Completed and tested on multiple devices.'] },
  { id: 't4', title: 'Develop Login Flow', description: 'Create login and registration flow in the mobile app.', dueDate: '2025-07-01', project: 'proj2', status: 'In Progress', comments: ['API integrated, UI half done.'] },
  { id: 't5', title: 'Push Notifications Setup', description: 'Configure FCM and push notification handling.', dueDate: '2025-07-10', project: 'proj2', status: 'To Do', comments: [] },
  { id: 't6', title: 'Build Task Tracker UI', description: 'Frontend screens for managing tasks in app.', dueDate: '2025-07-05', project: 'proj2', status: 'To Do', comments: [] },
  { id: 't7', title: 'Write Social Media Captions', description: 'Craft engaging captions for campaign posts.', dueDate: '2025-06-10', project: 'proj3', status: 'Done', comments: ['Reviewed by marketing.'] },
  { id: 't8', title: 'Schedule Posts', description: 'Use Buffer to schedule all posts across platforms.', dueDate: '2025-06-12', project: 'proj3', status: 'In Progress', comments: [] },
  { id: 't9', title: 'Design Campaign Graphics', description: 'Create Instagram and Twitter ad creatives.', dueDate: '2025-06-15', project: 'proj3', status: 'To Do', comments: [] }
];

const statusColors = {
  'To Do': 'error',
  'In Progress': 'warning',
  'Done': 'success',
};

export default function MyTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [commentInputs, setCommentInputs] = useState({});
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    setAnimateChart(true);
  }, []);

  const handleStatusChange = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleCommentChange = (id, newComment) => {
    setCommentInputs(prev => ({ ...prev, [id]: newComment }));
  };

  const handleSaveComment = (id) => {
    if (!commentInputs[id]) return;
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, comments: [...t.comments, commentInputs[id]] }
        : t
    ));
    setCommentInputs(prev => ({ ...prev, [id]: '' }));
  };

  const grouped = tasks.reduce((acc, task) => {
    (acc[task.project] = acc[task.project] || []).push(task);
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

  const [toDoDeg, inProgDeg, doneDeg] = chartData.map(d => (d.count / totalTasks) * 360);

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
                {name}: {Math.round((count / totalTasks) * 100)}%
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          {Object.keys(grouped).map(project => (
            <Box key={project} mb={5}>
              <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>{project.toUpperCase()}</Typography>
              <Divider sx={{ mb: 3 }} />
              <Grid container spacing={3}>
                {grouped[project].map(task => (
                  <Grid item xs={12} sm={6} md={4} key={task.id}>
                    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, background: '#ffffff', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>{task.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{task.description}</Typography>
                        <Chip label={task.status} color={statusColors[task.status]} size="small" sx={{ mb: 1 }} />
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <Select value={task.status} onChange={(e) => handleStatusChange(task.id, e.target.value)}>
                            <MenuItem value="To Do">To Do</MenuItem>
                            <MenuItem value="In Progress">In Progress</MenuItem>
                            <MenuItem value="Done">Done</MenuItem>
                          </Select>
                        </FormControl>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Due: {task.dueDate}</Typography>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Add comment..."
                          value={commentInputs[task.id] || ''}
                          onChange={(e) => handleCommentChange(task.id, e.target.value)}
                          sx={{ mb: 1 }}
                        />
                        <IconButton onClick={() => handleSaveComment(task.id)} color="primary" size="small">
                          <SaveIcon />
                        </IconButton>
                        <Divider sx={{ my: 1 }} />
                        {task.comments.map((c, i) => (
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
