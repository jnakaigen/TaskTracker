import React, { use } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  styled,
  alpha
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import { Navigate, NavLink } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

const drawerWidth = 260;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  width: '100%',
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
}));



const AdmDashLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admdash' },
    { text: 'Projects', icon: <WorkIcon />, path: '/projects' },
    { text: 'Team', icon: <GroupIcon />, path: '/team' },
    { text: 'Tasks', icon: <LayersIcon />, path: '/tasks' },
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
      borderRight: '1px solid rgba(0, 0, 0, 0.08)'
    }}>
      <Toolbar sx={{ 
        minHeight: '80px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Typography variant="h6" noWrap sx={{ 
          fontWeight: 700,
          background: 'linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AdminPanel
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.05)' }} />
      <List sx={{ px: 2, pt: 2, flex: 1 }}>
        {menuItems.map(({ text, icon, path }) => (
          <ListItem key={text} disablePadding>
            <StyledNavLink to={path}>
              <ListItemButton sx={{
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>{icon}</ListItemIcon>
                <ListItemText 
                  primary={text} 
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItemButton>
            </StyledNavLink>
          </ListItem>
        ))}
      </List>
      <Box sx={{ p: 2, pt: 0 }}>
        <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.05)', mb: 2 }} />
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );
  const navigate=useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f9fafc'
    }}>
      <CssBaseline />
      
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          color: 'text.primary',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600} sx={{ flexGrow: 1 }}>
            Dashboard Overview
          </Typography>
          <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            ml: 2,
            textTransform: 'none',
            borderRadius: 2
          }}
        >
          Logout
        </Button>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          maxWidth: '1600px',
          mx: 'auto'
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important' }} />
        <Box sx={{ 
          borderRadius: 3,
          minHeight: 'calc(100vh - 120px)',
          position: 'relative'
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdmDashLayout;