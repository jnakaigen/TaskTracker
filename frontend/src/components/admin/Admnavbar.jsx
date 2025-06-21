import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import {Link} from 'react-router-dom';
const Admnavbar = () => {
  return (
    <div> <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ backgroundColor: '#ffffff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>

        <Toolbar sx={{ px: 3, py: 1 }}>

          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, color: '#333' }}>
            TaskTracker
            </Typography>

          <Link to='/admdash'><Button color="inherit" sx={{ mx: 1, color: '#555', fontWeight: 500, textTransform: 'none', '&:hover': { color: '#1976d2' } }}>
Dashboard</Button></Link>
          <Link to='/projects'><Button color="inherit" sx={{ mx: 1, color: '#555', fontWeight: 500, textTransform: 'none', '&:hover': { color: '#1976d2' } }}>
Projects</Button></Link>
          <Link to='/team'><Button color="inherit" sx={{ mx: 1, color: '#555', fontWeight: 500, textTransform: 'none', '&:hover': { color: '#1976d2' } }}>
Team</Button></Link>
          <Link to='/tasks'><Button color="inherit" sx={{ mx: 1, color: '#555', fontWeight: 500, textTransform: 'none', '&:hover': { color: '#1976d2' } }}>
Tasks</Button></Link>
        </Toolbar>
      </AppBar>
    </Box></div>
  )
}

export default Admnavbar