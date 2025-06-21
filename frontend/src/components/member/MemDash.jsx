import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  CircularProgress,
  Divider,
  Avatar
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  HourglassEmpty,
  PieChart,
  BarChart,
  PriorityHigh,
  LowPriority,
  TrendingUp
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
const tasks = [
  {
    id: 't1',
    title: 'Design Landing Page',
    description: 'Create modern design for the new homepage with responsive elements.',
    dueDate: '2025-06-20',
    assignedTo: 'u2',
    project: 'proj1',
    status: 'In Progress',
    priority: 'High',
    comments: ['Mockups done. Need feedback from Alice.']
  },
  {
    id: 't2',
    title: 'Setup Hosting',
    description: 'Migrate website to new cloud hosting platform with CI/CD pipeline.',
    dueDate: '2025-06-22',
    assignedTo: 'u3',
    project: 'proj1',
    status: 'To Do',
    priority: 'Medium',
    comments: []
  },
  {
    id: 't3',
    title: 'Implement Mobile Navigation',
    description: 'Responsive navigation with accessibility features for mobile.',
    dueDate: '2025-06-25',
    assignedTo: 'u2',
    project: 'proj1',
    status: 'Done',
    priority: 'Medium',
    comments: ['Completed and tested on multiple devices.']
  },
  {
    id: 't4',
    title: 'Develop Login Flow',
    description: 'OAuth integration with social login options.',
    dueDate: '2025-07-01',
    assignedTo: 'u4',
    project: 'proj2',
    status: 'In Progress',
    priority: 'High',
    comments: ['API integrated, UI half done.']
  },
  {
    id: 't5',
    title: 'Push Notifications Setup',
    description: 'Configure FCM and implement notification center.',
    dueDate: '2025-07-10',
    assignedTo: 'u5',
    project: 'proj2',
    status: 'To Do',
    priority: 'Low',
    comments: []
  },
  {
    id: 't6',
    title: 'Build Task Tracker UI',
    description: 'Interactive task management interface with drag-and-drop.',
    dueDate: '2025-07-05',
    assignedTo: 'u2',
    project: 'proj2',
    status: 'To Do',
    priority: 'Medium',
    comments: []
  },
  {
    id: 't7',
    title: 'Write Social Media Captions',
    description: 'Engaging copy for Instagram, Twitter, and LinkedIn.',
    dueDate: '2025-06-10',
    assignedTo: 'u3',
    project: 'proj3',
    status: 'Done',
    priority: 'Low',
    comments: ['Reviewed by marketing.']
  },
  {
    id: 't8',
    title: 'Schedule Posts',
    description: 'Automated scheduling across all platforms with analytics.',
    dueDate: '2025-06-12',
    assignedTo: 'u5',
    project: 'proj3',
    status: 'In Progress',
    priority: 'Medium',
    comments: []
  },
  {
    id: 't9',
    title: 'Design Campaign Graphics',
    description: 'Social media creatives with brand consistency.',
    dueDate: '2025-06-15',
    assignedTo: 'u4',
    project: 'proj3',
    status: 'To Do',
    priority: 'High',
    comments: []
  },
];

const currentUserId = 'u2';

const MemDash = () => {
  // Filter tasks for current user
  const userTasks = tasks.filter(task => task.assignedTo === currentUserId);
  
  // Calculate progress
  const completedTasks = userTasks.filter(task => task.status === 'Done').length;
  const totalTasks = userTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Chart data
  const statusData = {
    labels: ['Done', 'In Progress', 'To Do'],
    datasets: [{
      data: [
        userTasks.filter(t => t.status === 'Done').length,
        userTasks.filter(t => t.status === 'In Progress').length,
        userTasks.filter(t => t.status === 'To Do').length
      ],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      borderWidth: 0,
    }],
  };

  const priorityData = {
    labels: userTasks.map(task => task.title),
    datasets: [{
      label: 'Days Until Due',
      data: userTasks.map(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      }),
      backgroundColor: '#2196F3',
    }],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle color="success" />;
      case 'In Progress': return <HourglassEmpty color="warning" />;
      default: return <RadioButtonUnchecked color="action" />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <PriorityHigh color="error" />;
      case 'Medium': return <TrendingUp color="warning" />;
      default: return <LowPriority color="success" />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        My Dashboard
      </Typography>
      
      {/* Progress Overview */}
      <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              Task Progress
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {completedTasks} of {totalTasks} tasks completed
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Chip 
                label={`${progressPercentage}%`} 
                color="primary" 
                sx={{ fontWeight: 'bold', mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Box sx={{ 
                  height: 8, 
                  bgcolor: '#E0E0E0', 
                  borderRadius: 4,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    width: `${progressPercentage}%`, 
                    height: '100%', 
                    bgcolor: 'primary.main' 
                  }} />
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 200 }}>
              <Doughnut 
                data={statusData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'right' }
                  }
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        {/* Task List */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight="medium" gutterBottom>
              My Tasks ({userTasks.length})
            </Typography>
            <List>
              {userTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemIcon>
                      {getStatusIcon(task.status)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography sx={{ mr: 1 }}>{task.title}</Typography>
                          {getPriorityIcon(task.priority)}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" component="span">
                            {task.description}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="text.secondary">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </Typography>
                        </>
                      }
                      secondaryTypographyProps={{ component: 'div' }}
                    />
                    <Chip 
                      label={task.project.replace('proj', 'Project ')}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Charts and Stats */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={3}>
            {/* Priority Distribution */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <BarChart color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" fontWeight="medium">
                    Task Timeline
                  </Typography>
                </Box>
                <Box sx={{ height: 250 }}>
                  <Bar 
                    data={priorityData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                          title: {
                            display: true,
                            text: 'Days Remaining'
                          }
                        },
                        x: {
                          ticks: {
                            display: false
                          }
                        }
                      }
                    }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="medium" gutterBottom>
                  Quick Stats
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#E3F2FD' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {userTasks.filter(t => t.priority === 'High').length}
                      </Typography>
                      <Typography variant="body2">High Priority</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#E8F5E9' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {userTasks.filter(t => t.status === 'Done').length}
                      </Typography>
                      <Typography variant="body2">Completed</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#FFF8E1' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {userTasks.filter(t => t.status === 'In Progress').length}
                      </Typography>
                      <Typography variant="body2">In Progress</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#FFEBEE' }}>
                      <Typography variant="h5" fontWeight="bold">
                        {userTasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length}
                      </Typography>
                      <Typography variant="body2">Overdue</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemDash;