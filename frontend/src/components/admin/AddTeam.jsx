import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, MenuItem, Paper, Snackbar, Alert
} from '@mui/material';

const roles = ['Admin', 'Team Member'];

export default function AddTeamMember({ onAdd }) {
    <AddTeamMember onAdd={handleAddMember} />

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Team Member',
    status: 'Active'
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.id || !formData.name || !formData.email) return;
    onAdd(formData);
    setSuccess(true);
    setFormData({ id: '', name: '', email: '', role: 'Team Member', status: 'Active' });
  };

  return (
    <Box component={Paper} p={4} maxWidth={500} mx="auto">
      <Typography variant="h5" gutterBottom>Add Team Member</Typography>
      <TextField
        label="ID"
        name="id"
        fullWidth
        margin="normal"
        value={formData.id}
        onChange={handleChange}
      />
      <TextField
        label="Name"
        name="name"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        label="Role"
        name="role"
        select
        fullWidth
        margin="normal"
        value={formData.role}
        onChange={handleChange}
      >
        {roles.map((role) => (
          <MenuItem key={role} value={role}>
            {role}
          </MenuItem>
        ))}
      </TextField>

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>Add Member</Button>
      </Box>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Team member added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}