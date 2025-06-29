import React, { useState } from 'react';
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
  alpha,
  Button,
  Avatar,
  Badge,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LayersIcon from '@mui/icons-material/Layers';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const drawerWidth = 280;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  width: '100%',
  display: 'flex',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(0.5),
  transition: 'all 0.3s ease',
  '&.active': {
    color: theme.palette.primary.main,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    '& .MuiListItemIcon-root': {
      color: theme.palette.primary.main,
    },
  },
  '&:hover:not(.active)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    transform: 'translateX(4px)'
  }
}));

const MotionListItem = motion(ListItem);
const MotionButton = motion(Button);

const AdmDashLayout = ({ children }) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admdash' },
    { text: 'Projects', icon: <WorkIcon />, path: '/admdash/projects' },
    { text: 'Team', icon: <GroupIcon />, path: '/admdash/team' },
    { text: 'Tasks', icon: <LayersIcon />, path: '/admdash/tasks' },
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
      borderRight: '1px solid rgba(0, 0, 0, 0.05)',
      boxShadow: '4px 0 30px rgba(0, 0, 0, 0.03)'
    }}>
      <Toolbar sx={{ 
        minHeight: '80px !important',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradient 8s ease infinite',
        '@keyframes gradient': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        }
      }}>
        <Typography variant="h6" noWrap sx={{ 
          fontWeight: 800,
          color: 'white',
          letterSpacing: '1px'
        }}>
          ADMIN PANEL
        </Typography>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.05)' }} />
      <List sx={{ px: 2, pt: 2, flex: 1 }}>
        {menuItems.map(({ text, icon, path }, index) => (
          <MotionListItem 
            key={text} 
            disablePadding
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StyledNavLink to={path}>
              <ListItemButton sx={{
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
                },
              }}>
                <ListItemIcon sx={{ minWidth: '40px' }}>{icon}</ListItemIcon>
                <ListItemText 
                  primary={text} 
                  primaryTypographyProps={{ 
                    fontWeight: 500,
                    fontSize: '0.95rem'
                  }}
                />
              </ListItemButton>
            </StyledNavLink>
          </MotionListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: '#f9fafc',
      backgroundImage: 'radial-gradient(at 40% 20%, hsla(240,100%,94%,0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.1) 0px, transparent 50%)'
    }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          backdropFilter: 'blur(16px)',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          color: 'text.primary',
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important', px: { sm: 3 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: '0.5px' }}>
            Dashboard Overview
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MotionButton
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                fontWeight: 500
              }}
              whileHover={{ 
                scale: 1.03,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)'
              }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </MotionButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              boxShadow: '4px 0 30px rgba(0, 0, 0, 0.1)',
              borderRight: 'none'
            },
          }}
        >
          {drawer}
        </Drawer>
        
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '4px 0 30px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '4px 0 30px rgba(0, 0, 0, 0.08)'
              }
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

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
          position: 'relative',
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          overflow: 'hidden',
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #1976d2 0%, #5e35b1 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradient 8s ease infinite',
            '@keyframes gradient': {
              '0%': { backgroundPosition: '0% 50%' },
              '50%': { backgroundPosition: '100% 50%' },
              '100%': { backgroundPosition: '0% 50%' }
            }
          }
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdmDashLayout;