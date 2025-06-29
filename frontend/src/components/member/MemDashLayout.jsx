import React from 'react';
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
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';

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

const MemDashLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/memdash' },
    { text: 'My Tasks', icon: <LayersIcon />, path: '/memdash/mytasks' }
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8faff 100%)',
      borderRight: '1px solid rgba(0, 0, 0, 0.08)'
    }}>
      {/* Sidebar Header with same text as AdmDashLayout */}
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
          MEMBER PANEL
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

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/login');
  };

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
          {/* Same font style as AdmDashLayout */}
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1, letterSpacing: '0.5px' }}>
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
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
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
              boxShadow: '4px 0 20px rgba(0, 0, 0, 0.05)'
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
          position: 'relative'
        }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default MemDashLayout;
