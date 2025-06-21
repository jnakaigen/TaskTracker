import React from 'react';
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
  Fade
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';
import { motion } from 'framer-motion';

const usersByRole = {
  Admin: ['Alice Johnson', 'Bob', 'Charlie'],
  Member: ['Bob Lee', 'Charlie Smith', 'Diana Prince', 'Ethan Ray'],
};

const AnimatedButton = motion(Button);
const AnimatedPaper = motion(Paper);

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = React.useState('');
  const [name, setName] = React.useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
    setName('');
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleLogin = () => {
    if (role === 'Admin') {
      navigate('/admdash');
    } else if (role === 'Member') {
      navigate('/memdash');
    }
  };

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
          <Avatar sx={{ 
            bgcolor: 'primary.main', 
            width: 60, 
            height: 60,
            mx: 'auto',
            mb: 2
          }}>
            <LockOutlined fontSize="large" />
          </Avatar>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Log in to manage your projects and tasks
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="role-label" sx={{ color: 'text.primary' }}>Role</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            label="Role"
            onChange={handleChange}
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Member">Member</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 4 }} disabled={!role}>
          <InputLabel id="name-label" sx={{ color: 'text.primary' }}>Name</InputLabel>
          <Select
            labelId="name-label"
            value={name}
            onChange={handleNameChange}
            label="Name"
            sx={{
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {role && usersByRole[role].map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <AnimatedButton
          fullWidth
          variant="contained"
          size="large"
          disabled={!role || !name}
          onClick={handleLogin}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            py: 1.5,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: 16,
            textTransform: 'none',
            boxShadow: '0 4px 14px rgba(0, 118, 255, 0.3)'
          }}
        >
          Log In
        </AnimatedButton>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Don't have access? Contact your administrator
        </Typography>
      </AnimatedPaper>
    </Box>
  );
};

export default Login;