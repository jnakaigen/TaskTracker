import React from 'react'
import { Button, FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Box } from '@mui/material';

const usersByRole = {
  Admin: ['Alice', 'Bob', 'Charlie'],
  Member: ['Dave', 'Eve', 'Frank'],
};

const Login = () => {
    const [role, setRole] = React.useState('');
    const [name, setName] = React.useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
    setName('');
  };
  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  return (
    <div style={{ 
  display: 'flex', 
  justifyContent: 'center', 
  alignItems: 'center', 
  height: '100vh', 
  background: 'linear-gradient(135deg, #c3e0e5, #a1c4fd)' 
}}>
        
    <Box
  sx={{
    width: 550,
    margin: 'auto',
    padding: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '70vh',
    borderRadius: 3,
    boxShadow: 4,
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
  }}
>

        <h1 style={{textAlign:'center',marginBottom:'1rem'}}>Welcome to Project Tasks Tracker</h1>
        <p style={{textAlign:'center',marginBottom:'1.5rem'}}>Please select your role and name to proceed.</p>      <FormControl fullWidth>
        <InputLabel id="role-label">Role</InputLabel>
        <Select
          labelId="role-label"
          id="demo-simple-select"
          value={role}
          label="Role"
          onChange={handleChange}
        >
          <MenuItem value={"Admin"}>Admin</MenuItem>
          <MenuItem value={"Member"}>Member</MenuItem>
        </Select>
        
      </FormControl>
      <FormControl disabled={!role} fullWidth sx={{ mt: 2 }}>
        <InputLabel id="name-label">Name</InputLabel>
        <Select
          labelId="name-label"
          id="demo-simple-select"
            value={name}
            onChange={handleNameChange}
            label="Name"
        >
            {role && usersByRole[role].map((user) => (
                <MenuItem key={user} value={user}>
                {user}
                </MenuItem>
            ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        disabled={!role || !name} // Disable button if role or name is not selected
        sx={{ mt: 2 }}
        onClick={() => {
          alert(`Logged in as ${name} (${role})`);
          // Here you can add the logic to redirect to the dashboard or perform login
        }}
      >
        Login
      </Button>
    </Box>

    </div>
    
  )
}

export default Login