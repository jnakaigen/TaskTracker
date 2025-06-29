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
  Divider,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedButton = motion(Button);
const AnimatedPaper = motion(Paper);
const AnimatedSelect = motion(FormControl);

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [users, setUsers] = useState({ Admin: [], Member: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [usersRes, teamsRes] = await Promise.all([
          fetch('http://localhost:4000/api/users'),
          fetch('http://localhost:4000/api/teams')
        ]);

        if (!usersRes.ok) throw new Error('Failed to load users');
        if (!teamsRes.ok) throw new Error('Failed to load team members');

        const usersData = await usersRes.json();
        const teamsData = await teamsRes.json();

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

    setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: 'white' }} />
        </motion.div>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(-45deg, #667eea, #764ba2, #6B8DD6, #8E37D7)',
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite',
        p: 2,
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}
    >
      <AnimatedPaper
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 450,
          p: 4,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 10, stiffness: 100 }}
          >
            <Avatar
              sx={{
                bgcolor: 'primary.main',
                width: 70,
                height: 70,
                mx: 'auto',
                mb: 2,
                boxShadow: '0 4px 12px rgba(103, 58, 183, 0.3)'
              }}
            >
              <LockOutlined fontSize="large" />
            </Avatar>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sign in to access your dashboard
            </Typography>
          </motion.div>
        </Box>

        <Divider sx={{ my: 3 }} />

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Typography 
                color="error" 
                sx={{ 
                  mb: 2, 
                  textAlign: 'center',
                  p: 1,
                  borderRadius: 1,
                  bgcolor: 'rgba(244, 67, 54, 0.1)'
                }}
              >
                {error}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin}>
          <AnimatedSelect
            fullWidth
            sx={{ mb: 3 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </AnimatedSelect>

          <AnimatePresence>
            {role && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <AnimatedSelect
                  fullWidth
                  sx={{ mb: 4 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <InputLabel id="user-label">Name</InputLabel>
                  <Select
                    labelId="user-label"
                    value={userId}
                    label="Name"
                    onChange={handleUserChange}
                    sx={{ borderRadius: 2 }}
                  >
                    {users[role]?.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}
                  </Select>
                </AnimatedSelect>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatedButton
            fullWidth
            variant="contained"
            size="large"
            disabled={!role || !userId || isSubmitting}
            type="submit"
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            whileTap={{ scale: 0.98 }}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 16,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              '&:disabled': {
                background: 'rgba(0, 0, 0, 0.12)'
              }
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Sign In'
            )}
          </AnimatedButton>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ 
              mt: 3, 
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            {role === 'Admin'
              ? 'Administrators can create and manage projects'
              : role === 'Member'
              ? 'Team members can view assigned projects and tasks'
              : 'Select your role to continue'}
          </Typography>
        </motion.div>
      </AnimatedPaper>
    </Box>
  );
};

export default Login;