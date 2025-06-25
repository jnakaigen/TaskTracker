import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, MenuItem,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Stack, Snackbar, Alert
} from '@mui/material';
import { Edit, Delete, CheckCircle, AccessTime, ErrorOutline } from '@mui/icons-material';

const Task = () => {
  /*
  const initialTasks = [
    { title: "Design Landing Page", description: "Create a modern design for the new homepage.", dueDate: "2025-06-20", assignedTo: "u2", project: "proj1", status: "In Progress" },
    { title: "Setup Hosting", description: "Set up the website on the new hosting platform.", dueDate: "2025-06-22", assignedTo: "u3", project: "proj1", status: "To Do" },
    { title: "Implement Mobile Navigation", description: "Ensure responsive navigation for mobile users.", dueDate: "2025-06-25", assignedTo: "u2", project: "proj1", status: "Done" },
    { title: "Develop Login Flow", description: "Create login and registration flow in the mobile app.", dueDate: "2025-07-01", assignedTo: "u4", project: "proj2", status: "In Progress" },
    { title: "Push Notifications Setup", description: "Configure FCM and push notification handling.", dueDate: "2025-07-10", assignedTo: "u5", project: "proj2", status: "To Do" },
    { title: "Build Task Tracker UI", description: "Frontend screens for managing tasks in app.", dueDate: "2025-07-05", assignedTo: "u2", project: "proj2", status: "To Do" },
    { title: "Write Social Media Captions", description: "Craft engaging captions for campaign posts.", dueDate: "2025-06-10", assignedTo: "u3", project: "proj3", status: "Done" },
    { title: "Schedule Posts", description: "Use Buffer to schedule all posts across platforms.", dueDate: "2025-06-12", assignedTo: "u5", project: "proj3", status: "In Progress" },
    { title: "Design Campaign Graphics", description: "Create Instagram and Twitter ad creatives.", dueDate: "2025-06-15", assignedTo: "u4", project: "proj3", status: "To Do" }
  ];
*/
  const [tasks, setTasks] = useState([]);
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

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:4000/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesProject = projectFilter === 'All' || task.project === projectFilter;
    const matchesMember = memberFilter === 'All' || task.assignedTo === memberFilter;
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesProject && matchesMember && matchesSearch;
  });

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.dueDate) {
      setError('Title and Due Date are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      setTasks(prev => [...prev, createdTask]);
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
      const response = await fetch(`http://localhost:4000/api/tasks/${taskToDelete._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(prev => prev.filter(task => task._id !== taskToDelete._id));
      setSuccess('Task deleted successfully');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditTask({ ...filteredTasks[index] });
  };

  const handleUpdateTask = async () => {
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

      {/* Loading indicator */}
      {loading && (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
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
              <Typography variant="h6" mb={2}><b>All Tasks</b></Typography>
              <TextField fullWidth placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} margin="dense" sx={{ bgcolor: 'white', border: '1px solid #aaa', borderRadius: 1 }} />

              <Box display="flex" gap={2} mt={2} mb={2}>
                <TextField select label={<b>All Status</b>} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} size="small" sx={{ flex: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #aaa' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="To Do">To Do</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Done">Done</MenuItem>
                </TextField>
                <TextField select label={<b>All Projects</b>} value={projectFilter} onChange={(e) => setProjectFilter(e.target.value)} size="small" sx={{ flex: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #aaa' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="proj1">proj1</MenuItem>
                  <MenuItem value="proj2">proj2</MenuItem>
                  <MenuItem value="proj3">proj3</MenuItem>
                </TextField>
                <TextField select label={<b>All Team Members</b>} value={memberFilter} onChange={(e) => setMemberFilter(e.target.value)} size="small" sx={{ flex: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #aaa' }}>
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="u2">u2</MenuItem>
                  <MenuItem value="u3">u3</MenuItem>
                  <MenuItem value="u4">u4</MenuItem>
                  <MenuItem value="u5">u5</MenuItem>
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
                          <TableCell>{task.project}</TableCell>
                          <TableCell>{task.status}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={2}>
                              <IconButton sx={{ color: 'blue' }} onClick={() => handleEdit(index)}><Edit /></IconButton>
                              <IconButton onClick={() => handleDelete(index)} sx={{ color: 'red' }}><Delete /></IconButton>
                            </Stack>
                          </TableCell>
                        </TableRow>
                        {editingIndex === index && (
                          <TableRow>
                            <TableCell colSpan={7}>
                              <Box mt={2} p={2} bgcolor="#fff" border="1px solid #ccc" borderRadius={2}>
                                <TextField fullWidth label="Title" value={editTask.title} onChange={e => setEditTask({ ...editTask, title: e.target.value })} sx={{ mb: 2 }} />
                                <TextField fullWidth label="Description" value={editTask.description} onChange={e => setEditTask({ ...editTask, description: e.target.value })} sx={{ mb: 2 }} multiline rows={2} />
                                <TextField fullWidth type="date" label="Due Date" value={editTask.dueDate.split('T')[0]} InputLabelProps={{ shrink: true }} onChange={e => setEditTask({ ...editTask, dueDate: e.target.value })} sx={{ mb: 2 }} />
                                <TextField fullWidth select label="Assigned To" value={editTask.assignedTo} onChange={e => setEditTask({ ...editTask, assignedTo: e.target.value })} sx={{ mb: 2 }}>
                                  <MenuItem value="u2">u2</MenuItem>
                                  <MenuItem value="u3">u3</MenuItem>
                                  <MenuItem value="u4">u4</MenuItem>
                                  <MenuItem value="u5">u5</MenuItem>
                                </TextField>
                                <TextField fullWidth select label="Project" value={editTask.project} onChange={e => setEditTask({ ...editTask, project: e.target.value })} sx={{ mb: 2 }}>
                                  <MenuItem value="proj1">proj1</MenuItem>
                                  <MenuItem value="proj2">proj2</MenuItem>
                                  <MenuItem value="proj3">proj3</MenuItem>
                                </TextField>
                                <TextField fullWidth select label="Status" value={editTask.status} onChange={e => setEditTask({ ...editTask, status: e.target.value })} sx={{ mb: 2 }}>
                                  <MenuItem value="To Do">To Do</MenuItem>
                                  <MenuItem value="In Progress">In Progress</MenuItem>
                                  <MenuItem value="Done">Done</MenuItem>
                                </TextField>
                                <Stack direction="row" spacing={2}>
                                  <Button variant="contained" color="primary" onClick={handleUpdateTask}>Update</Button>
                                  <Button variant="outlined" color="secondary" onClick={handleCancelEdit}>Cancel</Button>
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

              <TextField label={<b>Title</b>} fullWidth value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} />
              <TextField label={<b>Description</b>} fullWidth multiline rows={3} value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              <TextField label={<b>Due Date</b>} type="date" fullWidth InputLabelProps={{ shrink: true }} value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
              <TextField select label={<b>Assigned To</b>} fullWidth value={newTask.assignedTo} onChange={e => setNewTask({ ...newTask, assignedTo: e.target.value })}>
                <MenuItem value="u2">u2</MenuItem>
                <MenuItem value="u3">u3</MenuItem>
                <MenuItem value="u4">u4</MenuItem>
                <MenuItem value="u5">u5</MenuItem>
              </TextField>
              <TextField select label={<b>Project</b>} fullWidth value={newTask.project} onChange={e => setNewTask({ ...newTask, project: e.target.value })}>
                <MenuItem value="proj1">proj1</MenuItem>
                <MenuItem value="proj2">proj2</MenuItem>
                <MenuItem value="proj3">proj3</MenuItem>
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