import React, { useState } from 'react';
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

const projects = [
  {
    id: 'proj1',
    title: 'Website Revamp',
    description: 'Revamping the company website with modern UI/UX.',
    startDate: '2025-06-01',
    endDate: '2025-07-15',
    color: '#6366F1'
  },
  {
    id: 'proj2',
    title: 'Mobile App Launch',
    description: 'Develop and launch the mobile application.',
    startDate: '2025-06-10',
    endDate: '2025-08-01',
    color: '#10B981'
  },
  {
    id: 'proj3',
    title: 'Marketing Campaign',
    description: 'Summer marketing campaign for user engagement.',
    startDate: '2025-06-05',
    endDate: '2025-06-30',
    color: '#3B82F6'
  },
];

const teamMembers = [
  { id: 'u1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', avatar: 'AJ' },
  { id: 'u2', name: 'Bob Lee', email: 'bob@example.com', role: 'Designer', avatar: 'BL' },
  { id: 'u3', name: 'Charlie Smith', email: 'charlie@example.com', role: 'Developer', avatar: 'CS' },
  { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', role: 'Marketing', avatar: 'DP' },
  { id: 'u5', name: 'Ethan Ray', email: 'ethan@example.com', role: 'Developer', avatar: 'ER' },
];

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

  const getProjectTitle = (id) => projects.find(p => p.id === id)?.title || 'Unknown'; //Searches the projects array for an item where id matches the input. If found, returns the title property. If not found, returns 'Unknown' as a fallback
  const getMemberName = (id) => teamMembers.find(m => m.id === id)?.name || 'Unassigned'; 
  const getMemberAvatar = (id) => teamMembers.find(m => m.id === id)?.avatar || '?';
  const getProjectColor = (id) => projects.find(p => p.id === id)?.color || '#999';

  const filteredTasks = tasks.filter(task =>
    (selectedProject ? task.project === selectedProject : true) && 
    (selectedMember ? task.assignedTo === selectedMember : true)
  );

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === 'Done').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const pending = tasks.filter(t => t.status === 'To Do').length;

  const projectSummary = {};
  projects.forEach(proj => {
    projectSummary[proj.title] = tasks.filter(t => t.project === proj.id).length;
  });

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
          Dashboard Overview
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Chip
            icon={<People />}
            label={`${teamMembers.length} Team Members`}
            variant="outlined"
            sx={{ borderRadius: 1 }}
          />
          <Chip
            icon={<DateRange />}
            label={`${projects.length} Active Projects`}
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
        Project Distribution
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {projects.map((proj) => {
          const count = tasks.filter(t => t.project === proj.id).length;
          return (
            <Grid item xs={12} sm={6} md={4} key={proj.id}>
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
                      width: `${(count / tasks.length) * 100}%`,
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
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                label="Project"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Projects</MenuItem>
                {projects.map((proj) => (
                  <MenuItem key={proj.id} value={proj.id}>
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
            <FormControl fullWidth>
              <InputLabel>Team Member</InputLabel>
              <Select
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                label="Team Member"
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="">All Members</MenuItem>
                {teamMembers.map((mem) => (
                  <MenuItem key={mem.id} value={mem.id}>
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
                  
                  {task.comments.length > 0 && (
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