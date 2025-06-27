import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Paper, Avatar, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Stack, Divider, Snackbar, Alert
} from '@mui/material';
import { keyframes } from '@mui/system';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

export default function TeamDashboard() {
  const [members, setMembers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [newMember, setNewMember] = useState({
    id: '', name: '', email: '', role: '', img: '/avatar-placeholder.png'
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);

  // Fetch members from backend
  useEffect(() => {
    const fetchMembers = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/teams');
    const data = await res.json();
    setMembers(data);
  } catch (err) {
    setError('Failed to fetch teams');
  }
};
const fetchTasks = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };
    fetchMembers();
    fetchTasks();
  }, []);


  // Add member (POST)
  const handleAddSave = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMember)
      });
      if (response.ok) {
        const added = await response.json();
        setMembers(prev => [...prev, added]);
        setAddDialogOpen(false);
        setNewMember({ id: '', name: '', email: '', role: '', img: '/avatar-placeholder.png' });
        setSuccess('Team created successfully');
      }
    } catch (err) {
      console.error('Failed to add member:', err);
      setError('Failed to add member');
    }
  };

  // Edit member (PUT)
  const handleEditSave = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/teams/${selectedMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedMember)
      });
      if (response.ok) {
        const updated = await response.json();
        setMembers(prev => prev.map(m => (m.id === updated.id ? updated : m)));
        setEditDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to update member:', err);
      setError('Failed to update member');
    }
  };

  // Delete member (DELETE)
  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/teams/${selectedMember.id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setMembers(prev => prev.filter(m => m.id !== selectedMember.id));
        setDeleteDialogOpen(false);
      }
    } catch (err) {
      console.error('Failed to delete member:', err);
      setError('Failed to delete member');
    }
  };

  const openEditDialog = (member) => {
    setSelectedMember({ ...member });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (member) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
  };
const assignedIds = [...new Set(tasks.map(task => task.assignedTo))];
const assignedMembers = members.filter(member => assignedIds.includes(member.id));
  return (
    <Box style={{
        background: "linear-gradient(135deg,rgb(255, 255, 255),rgb(248, 248, 248))",
        minHeight: "100vh",
        padding: "24px",
      }} >
      {/* Success and Error Snackbar */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight={700} color="primary">Team Members</Typography>
          <Typography variant="body1" color="text.secondary">
            {members.length} Members: 1 Admin, {members.length - 1} Team Members
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="medium"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            background: 'linear-gradient(135deg,rgb(27, 136, 245) 30%,rgb(0, 0, 0) 90%)',
            color: '#fff',
            boxShadow: 3,
            '&:hover': { background: 'linear-gradient(135deg, #006fe6 30%, #00b8e6 90%)' }
          }}
          onClick={() => setAddDialogOpen(true)}
        >
          + Add Member
        </Button>
      </Stack>

      <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', animation: `${fadeIn} 0.3s ease-in` }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#e0e7ff' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignedMembers.map((member) => (
              <TableRow key={member.id} hover sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': { backgroundColor: '#f0f7ff' }
              }}>
                <TableCell>{member.id}</TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={member.img} sx={{ width: 32, height: 32 }} />
                    <Typography variant="body2">{member.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell align="center">
                  <Stack direction="row" justifyContent="center" spacing={1}>
                    <Button size="small" variant="contained" startIcon={<EditIcon />} color="primary" onClick={() => openEditDialog(member)}>
                      Edit
                    </Button>
                    <Button size="small" variant="contained" startIcon={<DeleteIcon />} color="error" onClick={() => openDeleteDialog(member)}>
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Member</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField label="Name" variant="outlined" fullWidth margin="dense"
            value={selectedMember?.name || ''}
            onChange={(e) => setSelectedMember({ ...selectedMember, name: e.target.value })} />
          <TextField label="Email" variant="outlined" fullWidth margin="dense"
            value={selectedMember?.email || ''}
            onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })} />
          <TextField label="Role" variant="outlined" fullWidth margin="dense"
            value={selectedMember?.role || ''}
            onChange={(e) => setSelectedMember({ ...selectedMember, role: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Add Member</DialogTitle>
        <Divider />
        <DialogContent>
          <TextField label="ID" variant="outlined" fullWidth margin="dense"
            value={newMember.id}
            onChange={(e) => setNewMember({ ...newMember, id: e.target.value })} />
          <TextField label="Name" variant="outlined" fullWidth margin="dense"
            value={newMember.name}
            onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
          <TextField label="Email" variant="outlined" fullWidth margin="dense"
            value={newMember.email}
            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} />
          <TextField label="Role" variant="outlined" fullWidth margin="dense"
            value={newMember.role}
            onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddSave} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Delete Member</DialogTitle>
        <Divider />
        <DialogContent>
          Are you sure you want to delete <strong>{selectedMember?.name}</strong>?
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}