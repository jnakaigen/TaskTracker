import React, { useState, useEffect } from 'react';
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
  Avatar,
  Grow,
  Fade,
  Zoom,
  Slide
} from '@mui/material';
import {
  CheckCircle,
  RadioButtonUnchecked,
  HourglassEmpty,
  PieChart,
  BarChart,
  PriorityHigh,
  LowPriority,
  TrendingUp,
  EmojiEvents,
  Alarm,
  Task
} from '@mui/icons-material';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { keyframes } from '@emotion/react';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

// Custom animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const MemDash = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [currentUser, setCurrentUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(''); 
  
  // Calculate progress
  const completedTasks = tasks.filter(task => task.status === 'Done').length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    setCurrentUser(user);
    const today = new Date();
  const formatted = today.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  setCurrentDate(formatted);

    fetch(`http://localhost:4000/api/tasks?assignedTo=${user.id}`)
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  // Chart data with enhanced styling
  const statusData = {
    labels: ['Done', 'In Progress', 'To Do'],
    datasets: [{
      data: [
        tasks.filter(t => t.status === 'Done').length,
        tasks.filter(t => t.status === 'In Progress').length,
        tasks.filter(t => t.status === 'To Do').length
      ],
      backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      borderWidth: 0,
      hoverOffset: 15,
      borderRadius: 10,
    }],
  };

  const priorityData = {
    labels: tasks.map(task => task.title),
    datasets: [{
      label: 'Days Until Due',
      data: tasks.map(task => {
        const dueDate = new Date(task.dueDate);
        const today = new Date();
        return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      }),
      backgroundColor: tasks.map(task => {
        const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft < 3 ? '#FF5252' : daysLeft < 7 ? '#FFC107' : '#4CAF50';
      }),
      borderRadius: 6,
      borderSkipped: false,
    }],
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Done': return <CheckCircle color="success" sx={{ fontSize: 28 }} />;
      case 'In Progress': return <HourglassEmpty color="warning" sx={{ fontSize: 28 }} />;
      default: return <RadioButtonUnchecked color="action" sx={{ fontSize: 28 }} />;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'High': return <PriorityHigh color="error" sx={{ fontSize: 22 }} />;
      case 'Medium': return <TrendingUp color="warning" sx={{ fontSize: 22 }} />;
      default: return <LowPriority color="success" sx={{ fontSize: 22 }} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%)'
      }}>
        <Fade in={true} timeout={1000}>
          <CircularProgress size={60} thickness={4} sx={{ color: '#3f51b5' }} />
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3, 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf3 100%)',
      minHeight: '100vh'
    }}>
      <Slide direction="down" in={true} timeout={500}>
        <Box>
        <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ 
          textAlign: 'center',
          background: 'linear-gradient(to right, #3f51b5, #2196f3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {currentUser.role === 'Member' 
              ? `Welcome  ${currentUser.name}`
              : `Welcome ${currentUser.name}`}
        </Typography>
        <Typography variant="subtitle1" align="center"
         color="text.secondary"
         sx={{mb: 3}}>
      {currentDate}
    </Typography>
        </Box>
      </Slide>
      
      {/* Progress Overview */}
      <Grow in={!loading} timeout={800}>
        <Paper elevation={4} sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)'
        }}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EmojiEvents color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h6" fontWeight="medium">
                  Task Progress
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary">
                {completedTasks} of {totalTasks} tasks completed
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                <Chip 
                  label={`${progressPercentage}%`} 
                  color="primary" 
                  sx={{ 
                    fontWeight: 'bold', 
                    mr: 2,
                    fontSize: '1rem',
                    animation: `${pulse} 2s infinite`,
                    boxShadow: '0 4px 6px rgba(63, 81, 181, 0.2)'
                  }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Box sx={{ 
                    height: 10, 
                    bgcolor: '#E0E0E0', 
                    borderRadius: 5,
                    overflow: 'hidden',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)'
                  }}>
                    <Box sx={{ 
                      width: `${progressPercentage}%`, 
                      height: '100%', 
                      bgcolor: 'primary.main',
                      background: 'linear-gradient(90deg, #3f51b5, #2196f3)',
                      transition: 'width 1s ease-in-out',
                      boxShadow: '0 2px 4px rgba(63, 81, 181, 0.3)'
                    }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                height: 200,
                animation: `${float} 6s ease-in-out infinite`,
                '&:hover': {
                  animation: `${pulse} 1s ease-in-out infinite`
                }
              }}>
                <Doughnut 
                  data={statusData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { 
                        position: 'right',
                        labels: {
                          font: {
                            size: 14,
                            family: "'Roboto', sans-serif"
                          },
                          padding: 20
                        }
                      },
                      tooltip: {
                        bodyFont: {
                          size: 14
                        },
                        titleFont: {
                          size: 16
                        }
                      }
                    },
                    cutout: '70%',
                    animation: {
                      animateScale: true,
                      animateRotate: true
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grow>

      <Grid container spacing={3}>
        {/* Task List */}
        <Grid item xs={12} md={7}>
          <Zoom in={!loading} timeout={800}>
            <Paper elevation={4} sx={{ 
              p: 3, 
              borderRadius: 3, 
              height: '100%',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Task color="primary" sx={{ fontSize: 28, mr: 1 }} />
                <Typography variant="h6" fontWeight="medium">
                  My Tasks ({tasks.length})
                </Typography>
              </Box>
              <List sx={{ maxHeight: '70vh', overflow: 'auto', pr: 1 }}>
                {tasks.map((task, index) => (
                  <Grow in={!loading} timeout={index * 100 + 500} key={task._id}>
                    <div>
                      <ListItem sx={{ 
                        py: 2,
                        mb: 1,
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.01)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          bgcolor: 'background.paper'
                        }
                      }}>
                        <ListItemIcon>
                          {getStatusIcon(task.status)}
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography sx={{ 
                                mr: 1,
                                fontWeight: 600,
                                background: 'linear-gradient(to right, #3f51b5, #2196f3)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>
                                {task.title}
                              </Typography>
                              {getPriorityIcon(task.priority)}
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" component="span" color="text.secondary">
                                {task.description}
                              </Typography>
                              <br />
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Alarm color="action" sx={{ fontSize: 16, mr: 0.5 }} />
                                <Typography variant="caption" color="text.secondary">
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </>
                          }
                          secondaryTypographyProps={{ component: 'div' }}
                        />
                        <Chip 
                          label={task.project.replace('proj', 'Project ')}
                          size="small"
                          sx={{ 
                            ml: 1,
                            bgcolor: '#E3F2FD',
                            color: '#1976D2',
                            fontWeight: 600,
                            boxShadow: '0 2px 4px rgba(25, 118, 210, 0.2)'
                          }}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(0,0,0,0.08)' }} />
                    </div>
                  </Grow>
                ))}
              </List>
            </Paper>
          </Zoom>
        </Grid>

        {/* Charts and Stats */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={3}>
            {/* Priority Distribution */}
            <Grid item xs={12}>
              <Slide direction="up" in={!loading} timeout={800}>
                <Paper elevation={4} sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <BarChart color="primary" sx={{ fontSize: 28, mr: 1 }} />
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
                              text: 'Days Remaining',
                              font: {
                                size: 14,
                                weight: 'bold'
                              }
                            },
                            grid: {
                              color: 'rgba(0,0,0,0.05)'
                            }
                          },
                          x: {
                            ticks: {
                              display: false
                            },
                            grid: {
                              display: false
                            }
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.parsed.y} days remaining`;
                              }
                            }
                          }
                        },
                        animation: {
                          duration: 2000
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Slide>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12}>
              <Fade in={!loading} timeout={1000}>
                <Paper elevation={4} sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)'
                  }
                }}>
                  <Typography variant="h6" fontWeight="medium" gutterBottom>
                    Quick Stats
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      { 
                        title: 'High Priority', 
                        value: tasks.filter(t => t.priority === 'High').length,
                        icon: <PriorityHigh color="error" sx={{ fontSize: 24 }} />,
                        color: '#FFEBEE'
                      },
                      { 
                        title: 'Completed', 
                        value: tasks.filter(t => t.status === 'Done').length,
                        icon: <CheckCircle color="success" sx={{ fontSize: 24 }} />,
                        color: '#E8F5E9'
                      },
                      { 
                        title: 'In Progress', 
                        value: tasks.filter(t => t.status === 'In Progress').length,
                        icon: <HourglassEmpty color="warning" sx={{ fontSize: 24 }} />,
                        color: '#FFF8E1'
                      },
                      { 
                        title: 'Overdue', 
                        value: tasks.filter(t => new Date(t.dueDate) < new Date() && t.status !== 'Done').length,
                        icon: <Alarm color="error" sx={{ fontSize: 24 }} />,
                        color: '#FFEBEE'
                      }
                    ].map((stat, index) => (
                      <Grow in={!loading} timeout={index * 200 + 800} key={stat.title}>
                        <Grid item xs={6}>
                          <Paper sx={{ 
                            p: 2, 
                            textAlign: 'center', 
                            bgcolor: stat.color,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                            }
                          }}>
                            <Box sx={{ 
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: 'rgba(255,255,255,0.8)',
                              mb: 1,
                              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                            }}>
                              {stat.icon}
                            </Box>
                            <Typography variant="h5" fontWeight="bold" sx={{ 
                              background: 'linear-gradient(to right, #3f51b5, #2196f3)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent'
                            }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 0.5 }}>{stat.title}</Typography>
                          </Paper>
                        </Grid>
                      </Grow>
                    ))}
                  </Grid>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemDash;