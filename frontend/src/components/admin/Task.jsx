import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Stack, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, CheckCircle, AccessTime, ErrorOutline } from '@mui/icons-material';

const Task = () => {
  // State variables
  const [tasks, setTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]); // Store all tasks from API
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
        setAllTasks(data); // Store all tasks
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Filter tasks based on user's projects whenever allTasks or projects change
  useEffect(() => {
    if (allTasks.length > 0 && projects.length > 0) {
      const filteredTasks = allTasks.filter(task => 
        userProjectIds.includes(task.project?.toString())
      );
      setTasks(filteredTasks);
    } else if (allTasks.length > 0 && projects.length === 0) {
      // If no projects loaded yet, show empty tasks
      setTasks([]);
    }
  }, [allTasks, userProjectIds]);

  // Fetch projects for the current admin
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Get current admin from localStorage
        const user = JSON.parse(localStorage.getItem('currentUser'));
        console.log('Current user from localStorage:', user);
        
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

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        
        // Extract all user IDs from both Admin and Member groups
        const allUserIds = [
          ...(data.Admin || []).map(user => user.id),
          ...(data.Member || []).map(user => user.id)
        ];
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        setTeamMembers(allUserIds);
      } catch (err) {
        setError('Failed to load team members: ' + err.message);
      }
    };

    fetchTeamMembers();
  }, []);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesProject = projectFilter === 'All' || task.project?.toString() === projectFilter;
    const matchesMember = memberFilter === 'All' || task.assignedTo?.toString() === memberFilter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesProject && matchesMember && matchesSearch;
  });

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.dueDate) {
      setError('Title and Due Date are required');
      return;
    }

    // Ensure the new task is assigned to one of the user's projects
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
        body: JSON.stringify({ ...newTask, adminId: user.id }) // <-- Make sure adminId is sent!
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      setTasks(prev => [...prev, createdTask]);
      setAllTasks(prev => [...prev, createdTask]); // Also update allTasks
      setNewTask({ title: '', description: '', dueDate: '', assignedTo: null, project: null, status: 'To Do' });
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
      setAllTasks(prev => prev.filter(task => task._id !== taskToDelete._id)); // Also update allTasks
      setRecentlyDeleted(taskToDelete);
      const timeout = setTimeout(() => {
        setRecentlyDeleted(null);
        deleteTaskFromBackend(taskToDelete._id);
      }, 15000);
      
      setUndoTimeout(timeout);
      
      setSuccess('Task deleted.');
      
    } catch (err) {
      setError(err.message);
    }
    finally {
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
      setAllTasks(prev => [...prev, recentlyDeleted]); // Also update allTasks
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
    // Ensure the updated task is still assigned to one of the user's projects
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
      setAllTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task)); // Also update allTasks
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

  const stats = [
    { label: 'Total Tasks', value: tasks.length, description: 'Overall tasks across all projects', icon: <CheckCircle color="primary" /> },
    { label: 'Completed Tasks', value: tasks.filter(t => t.status === 'Done').length, description: 'Tasks finished this period', icon: <CheckCircle sx={{ color: '#ddffbd' }} /> },
    { label: 'Pending Tasks', value: tasks.filter(t => t.status === 'To Do').length, description: 'Tasks awaiting completion', icon: <AccessTime color="warning" /> },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length, description: 'Currently active tasks', icon: <ErrorOutline color="error" /> },
  ];

  const handleCloseSnackbar = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Box p={3} sx={{ bgcolor: '#ffffff' }}>
      <Typography variant="h4" mb={3} fontWeight={600}>Task Management</Typography>

      {/* Error/Success notifications */}
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
              >
                UNDO
              </Button>
            }
          >
            Task deleted - Undo available for 15 seconds
          </Alert>
        </Snackbar>
      )}

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex', 
                  justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <Typography variant="h6">Loading...</Typography>
        </Box>
      )}

      <Box display="flex" gap={2} mb={3}>
        {stats.map((stat, i) => {
          let bgColor = '#abf7b1';
          if (stat.label === 'Total Tasks') bgColor = '#e8dde3';
          else if (stat.label === 'In Progress') bgColor = '#ffe5d9';
          else if (stat.label === 'Pending Tasks') bgColor = '#e6f0fa';
          else if (stat.label === 'Completed Tasks') bgColor = '#ddffbd';

          return (
            <Card key={i} variant="outlined" sx={{ flex: 1, bgcolor: bgColor }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="subtitle2">{stat.label}</Typography>
                  {stat.icon}
                </Box>
                <Typography variant="h5">{stat.value}</Typography>
                <Typography variant="caption">{stat.description}</Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box display="flex" gap={3} minHeight="800px" alignItems="stretch">
        <Box flex={3}>
          <Card sx={{ height: '105%', bgcolor: '#e6f0fa' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Typography variant="h6" mb={2}><b>My Tasks</b></Typography>
              <TextField 
                fullWidth 
                placeholder="Search tasks..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                margin="dense" 
                sx={{ bgcolor: 'white', border: '1px solid #aaa', borderRadius: 1 }} 
              />

              <Box display="flex" gap={2} mt={2} mb={2}>
                {/* Status Filter */}
                <TextField 
                  select 
                  label={<b>All Status</b>} 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)} 
                  size="small" 
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #aaa' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </TextField>
                
                {/* Project Filter - Only show user's projects */}
                <TextField 
                  select 
                  label={<b>My Projects</b>} 
                  value={projectFilter} 
                  onChange={(e) => setProjectFilter(e.target.value)} 
                  size="small" 
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #aaa' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {projects.map(project => (
                    <MenuItem key={project.pid} value={project.pid}>
                      {project.title}
                    </MenuItem>
                  ))}
                </TextField>
                
                {/* Team Member Filter */}
                <TextField 
                  select 
                  label={<b>All Team Members</b>} 
                  value={memberFilter} 
                  onChange={(e) => setMemberFilter(e.target.value)} 
                  size="small" 
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #aaa' }}
                >
                  <MenuItem value="All">All</MenuItem>
                  {teamMembers.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {user.id}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f2f2f2' }}>
                      <TableCell><b>Title</b></TableCell>
                      <TableCell><b>Description</b></TableCell>
                      <TableCell><b>Due Date</b></TableCell>
                      <TableCell><b>Assigned To</b></TableCell>
                      <TableCell><b>Project</b></TableCell>
                      <TableCell><b>Status</b></TableCell>
                      <TableCell><b>Actions</b></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTasks.map((task, index) => (
                      <React.Fragment key={task._id}>
                        <TableRow>
                          <TableCell>{task.title}</TableCell>
                          <TableCell>{task.description}</TableCell>
                          <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{task.assignedTo}</TableCell>
                          <TableCell>{projectMap[task.project] || task.project}</TableCell>
                          <TableCell>{task.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <IconButton sx={{ color: 'blue' }} onClick={() => handleEdit(index)}>
                                <Edit />
                              </IconButton>
                              <IconButton onClick={() => handleDelete(index)} sx={{ color: 'red' }}>
                                <Delete />
                              </IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        {editingIndex === index && (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <Box mt={2} p={2} bgcolor="#fff" border="1px solid #ccc" borderRadius={2}>
                                <TextField 
                                  fullWidth 
                                  label="Title" 
                                  value={editTask.title} 
                                  onChange={e => setEditTask({ ...editTask, title: e.target.value })} 
                                  sx={{ mb: 2 }} 
                                />
                                <TextField 
                                  fullWidth 
                                  label="Description" 
                                  value={editTask.description} 
                                  onChange={e => setEditTask({ ...editTask, description: e.target.value })} 
                                  sx={{ mb: 2 }} 
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
                                  sx={{ mb: 2 }} 
                                />
                                <TextField 
                                  fullWidth 
                                  select 
                                  label="Assigned To" 
                                  value={editTask.assignedTo} 
                                  onChange={e => setEditTask({ ...editTask, assignedTo: e.target.value })} 
                                  sx={{ mb: 2 }}
                                >
                                  {teamMembers.map(memberId => (
                                    <MenuItem key={memberId} value={memberId}>
                                      {memberId}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField 
                                  fullWidth 
                                  select 
                                  label="Project" 
                                  value={editTask.project} 
                                  onChange={e => setEditTask({ ...editTask, project: e.target.value })} 
                                  sx={{ mb: 2 }}
                                >
                                  {projects.map(project => (
                                    <MenuItem key={project.pid} value={project.pid}>
                                      {project.name}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField 
                                  fullWidth 
                                  select 
                                  label="Status" 
                                  value={editTask.status} 
                                  onChange={e => setEditTask({ ...editTask, status: e.target.value })} 
                                  sx={{ mb: 2 }}
                                >
                                  <MenuItem value="To Do">To Do</MenuItem>
                                  <MenuItem value="In Progress">In Progress</MenuItem>
                                  <MenuItem value="Done">Done</MenuItem>
                                </TextField>
                                <Stack direction="row" spacing={2}>
                                  <Button variant="contained" color="primary" onClick={handleUpdateTask}>
                                    Update
                                  </Button>
                                  <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>
                                    Cancel
                                  </Button>
                                </Stack>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        <Box flex={2}>
          <Card sx={{ height: '105%', bgcolor: '#e8dde3' }}>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                '& .MuiTextField-root': {
                  mb: 3,
                  bgcolor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#888'
                    }
                  }
                }
              }}
            >
              <Typography variant="h6" mb={2}><b>Create New Task</b></Typography>

              <TextField 
                label={<b>Title</b>} 
                fullWidth 
                value={newTask.title} 
                onChange={e => setNewTask({ ...newTask, title: e.target.value })} 
              />
              <TextField 
                label={<b>Description</b>} 
                fullWidth 
                multiline 
                rows={3} 
                value={newTask.description} 
                onChange={e => setNewTask({ ...newTask, description: e.target.value })} 
              />
              <TextField 
                label={<b>Due Date</b>} 
                type="date" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                value={newTask.dueDate} 
                onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} 
              />
              <TextField 
                select 
                label={<b>Assigned To</b>} 
                fullWidth 
                value={newTask.assignedTo} 
                onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}
              >
                {teamMembers.map(memberId => (
                  <MenuItem key={memberId} value={memberId}>
                    {memberId}
                  </MenuItem>
                ))}
              </TextField>
              <TextField 
                select 
                label={<b>Project</b>} 
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
                  onClick={handleCreateTask}
                  disabled={loading}
                  sx={{ backgroundColor: '#4f46e5', color: '#fff', '&:hover': { backgroundColor: '#3f3de6' } }}
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Task;