import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Paper,
  Avatar,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

const AnimatedButton = motion(Button);
const AnimatedPaper = motion(Paper);

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState({ Admin: [], Member: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // Fetch users and team members simultaneously
        const [usersRes, teamsRes] = await Promise.all([
          fetch('http://localhost:4000/api/users'),
          fetch('http://localhost:4000/api/teams')
        ]);

        if (!usersRes.ok) throw new Error('Failed to load users');
        if (!teamsRes.ok) throw new Error('Failed to load team members');

        const usersData = await usersRes.json();
        const teamsData = await teamsRes.json();

        // Combine results
        setUsers({
          Admin: usersData.Admin,
          Member: teamsData.map((t) => ({
            id: t.id,
            name: t.name
          }))
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load users. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setUserId('');
  };

  const handleUserChange = (e) => {
    setUserId(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const res = await fetch('http://localhost:4000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });

      const json = await res.json();
      if (res.ok) {
        localStorage.setItem('currentUser', JSON.stringify(json.user));
        navigate(json.redirectUrl);
      } else {
        setError(json.error || 'Login failed');
      }
    } catch (err) {
      setError('Login error. Please try again.');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <AnimatedPaper
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2
            }}
          >
            <LockOutlined fontSize="large" />
          </Avatar>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Task Tracker Login
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to access your dashboard
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {error && (
          <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleLogin}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              value={role}
              label="Role"
              onChange={handleRoleChange}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="Admin">Administrator</MenuItem>
              <MenuItem value="Member">Team Member</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 4 }} disabled={!role}>
            <InputLabel id="user-label">Name</InputLabel>
            <Select
              labelId="user-label"
              value={userId}
              label="Name"
              onChange={handleUserChange}
              sx={{ borderRadius: 2 }}
            >
              {role &&
                users[role]?.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <AnimatedButton
            fullWidth
            variant="contained"
            size="large"
            disabled={!role || !userId}
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 16,
              textTransform: 'none'
            }}
          >
            Sign In
          </AnimatedButton>
        </form>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, textAlign: 'center' }}
        >
          {role === 'Admin'
            ? 'Administrators can create and manage projects'
            : 'Team members can view assigned projects and tasks'}
        </Typography>
      </AnimatedPaper>
    </Box>
  );
};

export default Login;
