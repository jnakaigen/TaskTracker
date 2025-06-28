import React, { useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  Divider,
  useTheme
} from '@mui/material';
import {
  CheckCircleOutline,
  HourglassEmpty,
  Assignment,
  TrendingUp,
  People,
  DateRange,
  Comment
} from '@mui/icons-material';

const statusColors = {
  'Done': 'success',
  'In Progress': 'warning',
  'To Do': 'default'
};

const priorityColors = {
  'High': 'error',
  'Medium': 'warning',
  'Low': 'success'
};

const AdmDash = () => {
  const theme = useTheme();
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [userProjects, setUserProjects] = useState([]);
  const [userTasks, setUserTasks] = useState([]);
  const [userTeamMembers, setUserTeamMembers] = useState([]);

 useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('currentUser'));
  if (storedUser) {
    setCurrentUser(storedUser);

    // Fetch projects (this is correct if your backend supports it)
    fetch(`http://localhost:4000/api/projects?id=${storedUser.id}`)
      .then(res => res.json())
      .then(data => setUserProjects(Array.isArray(data) ? data : []))
      .catch(() => setUserProjects([]));

    // Fetch tasks (remove adminId if not supported)
    fetch('http://localhost:4000/api/tasks')
      .then(res => res.json())
      .then(data => setUserTasks(Array.isArray(data) ? data : []))
      .catch(() => setUserTasks([]));

    // Fetch team members (use plural "teams")
    fetch(`http://localhost:4000/api/teams?adminId=${storedUser.id}`)
      .then(res => res.json())
      .then(data => setUserTeamMembers(Array.isArray(data) ? data : []))
      .catch(() => setUserTeamMembers([]));
  }
}, []);

  // Corrected helper functions
  const getProjectTitle = (id) =>
    userProjects.find(p => p.id === id || p._id === id)?.title || 'Unknown';

  const getMemberName = (id) =>
    userTeamMembers.find(m => m.id === id || m._id === id)?.name || 'Unassigned';

  const getMemberAvatar = (id) =>
    userTeamMembers.find(m => m.id === id || m._id === id)?.avatar || '?';

  const getProjectColor = (id) =>
    userProjects.find(p => p.id === id || p._id === id)?.color || '#999';

  if (!currentUser) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    );
  }

  // Filter tasks based on selected project and member
const getId = val => (typeof val === 'object' && val !== null ? val.id || val._id : val);
const adminProjectPids = userProjects.map(p => p.pid);
const adminTasks = userTasks.filter(
  t => adminProjectPids.includes(t.project)
);
const filteredTasks = adminTasks.filter(task =>
  (selectedProject ? String(task.project) === String(selectedProject) : true) &&
  (selectedMember ? String(task.assignedTo) === String(selectedMember) : true)
);

  // Stats calculations
  const totalTasks = adminTasks.length;
  const completed = adminTasks.filter(t => t.status === 'Done').length;
  const inProgress = adminTasks.filter(t => t.status === 'In Progress').length;
  const pending = adminTasks.filter(t => t.status === 'To Do').length;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, icon: <Assignment fontSize="large" />, color: theme.palette.primary.main },
    { label: 'Completed', value: completed, icon: <CheckCircleOutline fontSize="large" />, color: theme.palette.success.main },
    { label: 'In Progress', value: inProgress, icon: <HourglassEmpty fontSize="large" />, color: theme.palette.warning.main },
    { label: 'Pending', value: pending, icon: <TrendingUp fontSize="large" />, color: theme.palette.info.main }
  ];

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight={700} color="text.primary">
          {currentUser.role === 'Admin' 
            ? `Welcome Admin ${currentUser.name}`
            : `Welcome ${currentUser.name}`}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<People />}
            label={`${userTeamMembers.length} Team Members`}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
          <Chip
            icon={<DateRange />}
            label={`${userProjects.length} Active Projects`}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map(({ label, value, icon, color }) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <Paper sx={{
              p: 3,
              borderRadius: 3,
              background: `linear-gradient(135deg, ${color}20, ${color}10)`,
              border: `1px solid ${color}30`,
              backdropFilter: 'blur(5px)',
              height: '100%'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: `${color}20`
                }}>
                  {React.cloneElement(icon, { sx: { color } })}
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                  <Typography variant="h4" fontWeight={700} color="text.primary">{value}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Project Summary */}
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mt: 4 }}>
        Your Projects
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {userProjects.map((proj) => {
const count = filteredTasks.filter(
  t => String(getId(t.project)) === String(proj.pid || proj._id)
).length;
          return (
            <Grid item xs={12} sm={6} md={4} key={proj.pid}>
              <Paper sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${proj.color}20, ${proj.color}10)`,
                borderLeft: `4px solid ${proj.color}`,
                height: '100%'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{proj.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{proj.description}</Typography>
                  </Box>
                  <Chip
                    label={`${count} task${count !== 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      bgcolor: `${proj.color}20`,
                      color: proj.color,
                      fontWeight: 600
                    }}
                  />
                </Box>
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption" color="text.secondary">
                    {proj.startDate} - {proj.endDate}
                  </Typography>
                  <Box sx={{
                    width: '60%',
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${proj.color}20`,
                    overflow: 'hidden'
                  }}>
                    <Box sx={{
                      width: `${(count / userTasks.length) * 100}%`,
                      height: '100%',
                      bgcolor: proj.color
                    }} />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Task Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl sx={{width:250, borderRadius: 2}}>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                label="Project"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Projects</MenuItem>
                {userProjects.map((proj) => (
                  <MenuItem key={proj.pid || proj._id} value={proj.pid || proj._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        bgcolor: proj.color
                      }} />
                      {proj.title}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl sx={{width:250, borderRadius: 2}}>
              <InputLabel>Team Member</InputLabel>
              <Select
                value={selectedMember}
                onChange={(e) => setSelectedMember(String(e.target.value))}
                label="Team Member"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Members</MenuItem>
                {userTeamMembers.map((mem) => (
                  <MenuItem key={mem.id || mem._id} value={mem.id || mem._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{
                        width: 24,
                        height: 24,
                        fontSize: 12,
                        bgcolor: theme.palette.primary.main
                      }}>
                        {mem.avatar}
                      </Avatar>
                      {mem.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Tasks Grid */}
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {filteredTasks.length} Task{filteredTasks.length !== 1 ? 's' : ''} Found
      </Typography>
      {filteredTasks.length ? (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} key={task.id}>
              <Paper sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${getProjectColor(task.project)}`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[6]
                }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={task.status}
                    size="small"
                    color={statusColors[task.status]}
                    variant="outlined"
                  />
                  <Chip
                    label={task.priority}
                    size="small"
                    color={priorityColors[task.priority]}
                  />
                </Box>
                <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                  {task.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                  {task.description}
                </Typography>
                
                <Box sx={{ mt: 'auto' }}>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{
                        width: 32,
                        height: 32,
                        fontSize: 14,
                        bgcolor: theme.palette.primary.main
                      }}>
                        {getMemberAvatar(task.assignedTo)}
                      </Avatar>
                      <Typography variant="body2">{getMemberName(task.assignedTo)}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      Due: {task.dueDate}
                    </Typography>
                  </Box>
                  
                  {Array.isArray(task.comments) && task.comments.length > 0 && (
                    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Comment color="action" fontSize="small" />
                      <Typography variant="caption" color="text.secondary">
                        {task.comments.length} comment{task.comments.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="body1" color="text.secondary">
            No tasks match the selected filters. Try adjusting your criteria.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AdmDash;