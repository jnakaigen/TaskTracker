import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Stack, Snackbar, Alert, Chip,
  Avatar, LinearProgress, Tooltip, Divider
} from '@mui/material';
import { 
  Edit, Delete, CheckCircle, AccessTime, ErrorOutline, 
  Search, AddTask, Task as TaskIcon, CalendarToday, Group, Folder
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';


const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: '12px',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 24px 0 rgba(0,0,0,0.15)'
  }
}));

const StatusChip = styled(Chip)(({ status }) => ({
  fontWeight: 600,
  ...(status === 'Done' && {
    backgroundColor: '#e6f7e6',
    color: '#2e7d32'
  }),
  ...(status === 'In Progress' && {
    backgroundColor: '#fff8e1',
    color: '#ed6c02'
  }),
  ...(status === 'To Do' && {
    backgroundColor: '#e3f2fd',
    color: '#1976d2'
  })
}));

// Helper function for avatar colors
function stringToColor(string) {
  if (!string) return '#000000';
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignedTo: '',
    project: '',
    status: 'To Do'
  });

  const [statusFilter, setStatusFilter] = useState('All');
  const [projectFilter, setProjectFilter] = useState('All');
  const [memberFilter, setMemberFilter] = useState('All');
  const [search, setSearch] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [undoTimeout, setUndoTimeout] = useState(null);

  // Create project map for ID to name conversion
  const projectMap = useMemo(() => {
    return projects.reduce((map, project) => {
      map[project.pid] = project.name;
      return map;
    }, {});
  }, [projects]);

  // Get current user's project IDs
  const userProjectIds = useMemo(() => {
    return projects.map(project => project.pid);
  }, [projects]);

  // Cleanup effect for undo timeout
  useEffect(() => {
    return () => {
      if (undoTimeout) {
        clearTimeout(undoTimeout);
      }
    };
  }, [undoTimeout]);

  // Fetch all tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setAllTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTeamMembers = async () => {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const res = await fetch(`http://localhost:4000/api/teams?adminId=${user.id}`);
      const data = await res.json();
      setTeamMembers(data);
    };
  
    fetchTasks();
    fetchTeamMembers();
  }, []);

  // Filter tasks based on user's projects
  useEffect(() => {
    if (allTasks.length > 0 && projects.length > 0) {
      const filteredTasks = allTasks.filter(task => 
        userProjectIds.includes(task.project?.toString())
      );
      setTasks(filteredTasks);
    } else if (allTasks.length > 0 && projects.length === 0) {
      setTasks([]);
    }
  }, [allTasks, userProjectIds]);

  // Fetch projects for the current admin
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        const response = await fetch(`http://localhost:4000/api/projects?id=${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchProjects();
  }, []);

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      const matchesProject = projectFilter === 'All' || task.project?.toString() === projectFilter;
      const matchesMember = memberFilter === 'All' || task.assignedTo?.toString() === memberFilter;
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesProject && matchesMember && matchesSearch;
    });
  }, [tasks, statusFilter, projectFilter, memberFilter, search]);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.dueDate) {
      setError('Title and Due Date are required');
      return;
    }

    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(newTask.dueDate);
    dueDate.setHours(0,0,0,0);
    if (dueDate < today) {
      setError('Please select today or a future date for the due date.');
      return;
    }

    if (!newTask.project || !userProjectIds.includes(newTask.project)) {
      setError('Please select a valid project');
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('currentUser'));
      const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...newTask, adminId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      setTasks(prev => [...prev, createdTask]);
      setAllTasks(prev => [...prev, createdTask]);
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: '', project: '', status: 'To Do' });
      setSuccess('Task created successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (index) => {
    const taskToDelete = filteredTasks[index];
    try {
      setLoading(true);
      setTasks(prev => prev.filter(task => task._id !== taskToDelete._id));
      setAllTasks(prev => prev.filter(task => task._id !== taskToDelete._id));
      setRecentlyDeleted(taskToDelete);
      const timeout = setTimeout(() => {
        setRecentlyDeleted(null);
        deleteTaskFromBackend(taskToDelete._id);
      }, 5000);
      
      setUndoTimeout(timeout);
      setSuccess('Task deleted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTaskFromBackend = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to permanently delete task');
      }
    } catch (error) {
      console.error('Permanent deletion error:', error);
    }
  };

  const handleUndoDelete = async () => {
    if (!recentlyDeleted) return;
    
    try {
      setTasks(prev => [...prev, recentlyDeleted]);
      setAllTasks(prev => [...prev, recentlyDeleted]);
      setRecentlyDeleted(null);

      if (undoTimeout) {
        clearTimeout(undoTimeout);
        setUndoTimeout(null);
      }
      
      setSuccess('Task restored successfully');
    } catch (err) {
      setError('Failed to undo deletion: ' + err.message);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTask({ ...filteredTasks[index] });
  };

  const handleUpdateTask = async () => {
    if (!editTask.project || !userProjectIds.includes(editTask.project)) {
      setError('Please select a valid project');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:4000/api/tasks/${editTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editTask),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
      setAllTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
      setEditingIndex(null);
      setEditTask(null);
      setSuccess('Task updated successfully');
    } catch (err) {
      setError(err.message);
      console.error('Update error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditTask(null);
  };

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  // Enhanced stats with icons and colors
  const stats = [
    { 
      label: 'Total Tasks', 
      value: tasks.length, 
      description: 'Overall tasks across all projects', 
      icon: <TaskIcon color="primary" />,
      color: 'linear-gradient(135deg, #e8dde3 0%, #f3e7e9 100%)'
    },
    { 
      label: 'Completed', 
      value: tasks.filter(t => t.status === 'Done').length, 
      description: 'Tasks finished this period', 
      icon: <CheckCircle sx={{ color: '#4caf50' }} />,
      color: 'linear-gradient(135deg, #ddffbd 0%, #ccfbff 100%)'
    },
    { 
      label: 'Pending', 
      value: tasks.filter(t => t.status === 'To Do').length, 
      description: 'Tasks awaiting completion', 
      icon: <AccessTime color="warning" />,
      color: 'linear-gradient(135deg, #e6f0fa 0%, #f0f7fa 100%)'
    },
    { 
      label: 'In Progress', 
      value: tasks.filter(t => t.status === 'In Progress').length, 
      description: 'Currently active tasks', 
      icon: <ErrorOutline color="info" />,
      color: 'linear-gradient(135deg, #ffe5d9 0%, #fff3e0 100%)'
    },
  ];

  // Enhanced member display
  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : memberId;
  };

  const getMemberInitials = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    if (!member || !member.name) return '?';
    return member.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Enhanced project display
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.pid === projectId);
    return project ? project.title : projectId;
  };

  return (
    <Box p={3} sx={{ 
      bgcolor: '#f9fafb', 
      minHeight: '100vh',
      backgroundImage: 'linear-gradient(to bottom, #f5f7fa 0%, #f9fafb 100%)'
    }}>
      <Typography variant="h4" mb={3} fontWeight={600} color="text.primary">
        Task Management
      </Typography>

      {/* Notifications */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      
      {recentlyDeleted && (
        <Snackbar
          open={true}
          autoHideDuration={null}
          onClose={() => setRecentlyDeleted(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            severity="info" 
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={handleUndoDelete}
                sx={{ fontWeight: 600 }}
              >
                UNDO
              </Button>
            }
            sx={{ width: '100%' }}
          >
            Task deleted - Undo available for 5 seconds
          </Alert>
        </Snackbar>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(255,255,255,0.7)', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          zIndex: 9999,
          flexDirection: 'column'
        }}>
          <LinearProgress sx={{ width: '300px', height: '6px', borderRadius: '3px' }} />
          <Typography variant="h6" mt={2} color="text.secondary">Loading...</Typography>
        </Box>
      )}

      {/* Stats Cards */}
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        {stats.map((stat, i) => (
          <StyledCard key={i} sx={{ 
            flex: '1 1 200px', 
            minWidth: '200px',
            background: stat.color
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                  {stat.label}
                </Typography>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {stat.icon}
                </Box>
              </Box>
              <Typography variant="h4" fontWeight={700} color="text.primary">
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stat.description}
              </Typography>
            </CardContent>
          </StyledCard>
        ))}
      </Box>

      <Box display="flex" gap={3} minHeight="800px" alignItems="stretch" flexDirection={{ xs: 'column', lg: 'row' }}>
        {/* Task List Section */}
        <Box flex={3}>
          <StyledCard sx={{ height: '100%' }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              p: 0,
              '&:last-child': { pb: 0 }
            }}>
              <Box p={3} pb={2}>
                <Typography variant="h6" mb={2} fontWeight={600} color="text.primary">
                  My Tasks
                </Typography>
                
                <Box display="flex" gap={2} alignItems="center" mb={2}>
                  <TextField
                    fullWidth
                    placeholder="Search tasks..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    margin="dense"
                    InputProps={{
                      startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />
                    }}
                    sx={{
                      bgcolor: 'background.paper',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  />
                </Box>

                <Box display="flex" gap={2} mb={2} flexWrap="wrap">
                  {/* Status Filter */}
                  <TextField
                    select
                    label="Status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    size="small"
                    sx={{ 
                      minWidth: '120px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  >
                    <MenuItem value="All">All Status</MenuItem>
                    <MenuItem value="To Do">To Do</MenuItem>
                    <MenuItem value="In Progress">In Progress</MenuItem>
                    <MenuItem value="Done">Done</MenuItem>
                  </TextField>
                  
                  {/* Project Filter */}
                  <TextField
                    select
                    label="Project"
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    size="small"
                    sx={{ 
                      minWidth: '150px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  >
                    <MenuItem value="All">All Projects</MenuItem>
                    {projects.map(project => (
                      <MenuItem key={project.pid} value={project.pid}>
                        {project.title}
                      </MenuItem>
                    ))}
                  </TextField>
                  
                  {/* Team Member Filter */}
                  <TextField
                    select
                    label="Team Member"
                    value={memberFilter}
                    onChange={(e) => setMemberFilter(e.target.value)}
                    size="small"
                    sx={{ 
                      minWidth: '150px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px'
                      }
                    }}
                  >
                    <MenuItem value="All">All Members</MenuItem>
                    {teamMembers.map(user => (
                      <MenuItem key={user.id} value={user.id}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Box>

              <Divider />

              <TableContainer component={Paper} elevation={0} sx={{ flex: 1, borderRadius: 0 }}>
                <Table sx={{ minWidth: 650 }} aria-label="task table">
                  <TableHead sx={{ bgcolor: 'background.default' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Project</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTasks.length > 0 ? (
                      filteredTasks.map((task, index) => (
                        <React.Fragment key={task._id}>
                          <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell>
                              <Typography fontWeight={500}>{task.title}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" color="text.secondary">
                                {task.description || '-'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <CalendarToday fontSize="small" color="action" />
                                <Typography>
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Avatar sx={{ 
                                  width: 28, 
                                  height: 28, 
                                  bgcolor: stringToColor(getMemberName(task.assignedTo)),
                                  fontSize: '0.75rem'
                                }}>
                                  {getMemberInitials(task.assignedTo)}
                                </Avatar>
                                <Typography>{getMemberName(task.assignedTo)}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center" gap={1}>
                                <Folder fontSize="small" color="action" />
                                <Typography>{getProjectName(task.project)}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <StatusChip 
                                label={task.status} 
                                status={task.status} 
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Edit">
                                  <IconButton 
                                    onClick={() => handleEdit(index)}
                                    sx={{ color: 'primary.main' }}
                                  >
                                    <Edit fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                  <IconButton 
                                    onClick={() => handleDelete(index)}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                          {editingIndex === index && editTask && (
                            <TableRow>
                              <TableCell colSpan={7} sx={{ p: 0 }}>
                                <Box p={3} bgcolor="background.paper" border="1px solid" borderColor="divider" borderRadius={1}>
                                  <Typography variant="subtitle1" mb={2} fontWeight={600}>
                                    Edit Task
                                  </Typography>
                                  <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={2}>
                                    <TextField
                                      fullWidth
                                      label="Title"
                                      value={editTask.title}
                                      onChange={e => setEditTask({ ...editTask, title: e.target.value })}
                                    />
                                    <TextField
                                      fullWidth
                                      label="Description"
                                      value={editTask.description}
                                      onChange={e => setEditTask({ ...editTask, description: e.target.value })}
                                      multiline
                                      rows={2}
                                    />
                                    <TextField
                                      fullWidth
                                      type="date"
                                      label="Due Date"
                                      value={editTask.dueDate.split('T')[0]}
                                      InputLabelProps={{ shrink: true }}
                                      onChange={e => setEditTask({ ...editTask, dueDate: e.target.value })}
                                    />
                                    <TextField
                                      fullWidth
                                      select
                                      label="Assigned To"
                                      value={editTask.assignedTo}
                                      onChange={e => setEditTask({ ...editTask, assignedTo: e.target.value })}
                                    >
                                      {teamMembers.map(member => (
                                        <MenuItem key={member.id} value={member.id}>
                                          {member.name}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                    <TextField
                                      fullWidth
                                      select
                                      label="Project"
                                      value={editTask.project}
                                      onChange={e => setEditTask({ ...editTask, project: e.target.value })}
                                    >
                                      {projects.map(project => (
                                        <MenuItem key={project.pid} value={project.pid}>
                                          {project.title}
                                        </MenuItem>
                                      ))}
                                    </TextField>
                                    
                                  </Box>
                                  <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
                                    <Button 
                                      variant="outlined" 
                                      color="inherit" 
                                      onClick={handleCancelEdit}
                                    >
                                      Cancel
                                    </Button>
                                    <Button 
                                      variant="contained" 
                                      color="primary" 
                                      onClick={handleUpdateTask}
                                    >
                                      Update Task
                                    </Button>
                                  </Stack>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <TaskIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                            <Typography variant="h6" color="text.secondary">
                              No tasks found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your filters or create a new task
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </StyledCard>
        </Box>

        {/* Create Task Section */}
        <Box flex={2} minWidth="300px">
          <StyledCard sx={{ height: '100%' }}>
            <CardContent sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              height: '100%',
              p: 3,
              '& .MuiTextField-root': {
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px'
                }
              }
            }}>
              <Box display="flex" alignItems="center" mb={3}>
                <AddTask color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  Create New Task
                </Typography>
              </Box>

              <TextField
                label="Title"
                fullWidth
                value={newTask.title}
                onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Enter task title"
              />
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={newTask.description}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Enter task description"
              />
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={newTask.dueDate}
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
              <TextField
                select
                label="Assign To"
                value={newTask.assignedTo}
                onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
                fullWidth
              >
                {teamMembers.map(member => (
                  <MenuItem key={member.id} value={member.id}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: stringToColor(member.name),
                        fontSize: '0.7rem'
                      }}>
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </Avatar>
                      {member.name}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Project"
                fullWidth
                value={newTask.project}
                onChange={e => setNewTask({ ...newTask, project: e.target.value })}
              >
                {projects.map(project => (
                  <MenuItem key={project.pid} value={project.pid}>
                    {project.title}
                  </MenuItem>
                ))}
              </TextField>

              <Box mt="auto">
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCreateTask}
                  disabled={loading}
                  startIcon={<AddTask />}
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '8px',
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
              </Box>
            </CardContent>
          </StyledCard>
        </Box>
      </Box>
    </Box>
  );
};

export default TaskManagement;