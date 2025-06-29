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
  useTheme,
  Skeleton
} from '@mui/material';
import {
  CheckCircleOutline,
  HourglassEmpty,
  Assignment,
  TrendingUp,
  People,
  DateRange,
  Comment,
  FilterList,
  Dashboard
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const MotionPaper = motion(Paper);
const MotionChip = motion(Chip);
const MotionAvatar = motion(Avatar);

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);

      Promise.all([
        fetch(`http://localhost:4000/api/projects?id=${storedUser.id}`),
        fetch('http://localhost:4000/api/tasks'),
        fetch(`http://localhost:4000/api/teams?adminId=${storedUser.id}`)
      ])
        .then(async ([projectsRes, tasksRes, teamsRes]) => {
          const projectsData = await projectsRes.json();
          const tasksData = await tasksRes.json();
          const teamsData = await teamsRes.json();

          setUserProjects(Array.isArray(projectsData) ? projectsData : []);
          setUserTasks(Array.isArray(tasksData) ? tasksData : []);
          setUserTeamMembers(Array.isArray(teamsData) ? teamsData : []);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const getProjectTitle = (id) =>
    userProjects.find(p => p.id === id || p._id === id)?.title || 'Unknown';

  const getMemberName = (id) =>
    userTeamMembers.find(m => m.id === id || m._id === id)?.name || 'Unassigned';

  const getMemberAvatar = (id) =>
    userTeamMembers.find(m => m.id === id || m._id === id)?.avatar || '?';

  const getProjectColor = (id) =>
    userProjects.find(p => p.id === id || p._id === id)?.color || theme.palette.primary.main;

  const getId = val => (typeof val === 'object' && val !== null ? val.id || val._id : val);
  const adminProjectPids = userProjects.map(p => p.pid);
  const adminTasks = userTasks.filter(t => adminProjectPids.includes(t.project));
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
    { label: 'Total Tasks', value: totalTasks, icon: <Assignment />, color: theme.palette.primary.main },
    { label: 'Completed', value: completed, icon: <CheckCircleOutline />, color: theme.palette.success.main },
    { label: 'In Progress', value: inProgress, icon: <HourglassEmpty />, color: theme.palette.warning.main },
    { label: 'Pending', value: pending, icon: <TrendingUp />, color: theme.palette.info.main }
  ];

  if (!currentUser) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      px: { xs: 2, md: 4 }, 
      py: 3,
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 4,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight={700} color="text.primary">
            {currentUser.role === 'Admin' 
              ? `Welcome Admin ${currentUser.name}`
              : `Welcome ${currentUser.name}`}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
        </motion.div>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MotionChip
            icon={<People />}
            label={`${userTeamMembers.length} Team Members`}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            whileHover={{ scale: 1.05 }}
          />
          <MotionChip
            icon={<DateRange />}
            label={`${userProjects.length} Active Projects`}
            variant="outlined"
            sx={{ borderRadius: 2 }}
            whileHover={{ scale: 1.05 }}
          />
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map(({ label, value, icon, color }, index) => (
          <Grid item xs={12} sm={6} md={3} key={label}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              sx={{
                p: 3,
                borderRadius: 3,
                background: `linear-gradient(135deg, ${color}15, ${color}08)`,
                border: `1px solid ${color}20`,
                backdropFilter: 'blur(8px)',
                height: '100%',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: `0 10px 20px ${color}20`
                }
              }}
              whileHover={{ y: -5 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MotionAvatar
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    bgcolor: `${color}20`,
                    color: color
                  }}
                  whileHover={{ rotate: 10 }}
                >
                  {icon}
                </MotionAvatar>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                  <Typography variant="h4" fontWeight={700} color="text.primary">
                    {loading ? <Skeleton width={60} /> : value}
                  </Typography>
                </Box>
              </Box>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>

      {/* Project Summary */}
      <MotionPaper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Dashboard color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Your Projects
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          {loading ? (
            Array(3).fill().map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={150} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
          ) : userProjects.length > 0 ? (
            userProjects.map((proj) => {
              const count = filteredTasks.filter(
                t => String(getId(t.project)) === String(proj.pid || proj._id)
              ).length;
              
              return (
                <Grid item xs={12} sm={6} md={4} key={proj.pid}>
                  <MotionPaper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${proj.color}15, ${proj.color}08)`,
                      borderLeft: `4px solid ${proj.color}`,
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 10px 20px ${proj.color}20`
                      }
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={600}>{proj.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {proj.description}
                        </Typography>
                      </Box>
                      <MotionChip
                        label={`${count} task${count !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          bgcolor: `${proj.color}20`,
                          color: proj.color,
                          fontWeight: 600
                        }}
                        whileHover={{ scale: 1.05 }}
                      />
                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / Math.max(1, userTasks.length)) * 100}%` }}
                          transition={{ duration: 1 }}
                          style={{
                            height: '100%',
                            backgroundColor: proj.color,
                            borderRadius: 3
                          }}
                        />
                      </Box>
                    </Box>
                  </MotionPaper>
                </Grid>
              );
            })
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                <Typography variant="body1" color="text.secondary">
                  No projects found
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </MotionPaper>

      {/* Filters */}
      <MotionPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FilterList color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Task Filters
          </Typography>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl sx={{ width: 250, maxWidth: 350 }}>
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
            <FormControl sx={{ width: 250, maxWidth: 350 }}>
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
      </MotionPaper>

      {/* Tasks Grid */}
      <MotionPaper
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        sx={{ 
          p: 3, 
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography variant="h6" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Assignment color="primary" />
          {filteredTasks.length} Task{filteredTasks.length !== 1 ? 's' : ''} Found
        </Typography>
        
        {loading ? (
          <Grid container spacing={3}>
            {Array(3).fill().map((_, i) => (
              <Grid item xs={12} sm={6} lg={4} key={i}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 3 }} />
              </Grid>
            ))}
          </Grid>
        ) : filteredTasks.length ? (
          <Grid container spacing={3}>
            {filteredTasks.map((task, index) => (
              <Grid item xs={12} sm={6} lg={4} key={task.id}>
                <MotionPaper
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    borderLeft: `4px solid ${getProjectColor(task.project)}`,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 15px 30px rgba(0, 0, 0, 0.1)`
                    }
                  }}
                  whileHover={{ y: -8 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <MotionChip
                      label={task.status}
                      size="small"
                      color={statusColors[task.status]}
                      variant="outlined"
                      whileHover={{ scale: 1.05 }}
                    />
                    <MotionChip
                      label={task.priority}
                      size="small"
                      color={priorityColors[task.priority]}
                      whileHover={{ scale: 1.05 }}
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
                        <MotionAvatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: 14,
                            bgcolor: theme.palette.primary.main
                          }}
                          whileHover={{ rotate: 10 }}
                        >
                          {getMemberAvatar(task.assignedTo)}
                        </MotionAvatar>
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
                </MotionPaper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center', 
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)'
          }}>
            <Typography variant="body1" color="text.secondary">
              No tasks match the selected filters. Try adjusting your criteria.
            </Typography>
          </Paper>
        )}
      </MotionPaper>
    </Box>
  );
};

export default AdmDash;