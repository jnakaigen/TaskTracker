import React from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  useTheme,
  CssBaseline,
  Avatar,
  Stack
} from '@mui/material';
import { 
  Dashboard, 
  Group, 
  Task, 
  TrendingUp, 
  LockOpen,
  Palette,
  MobileFriendly,
  FormatQuote
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Animated Components
const AnimatedBox = motion(Box);
const AnimatedTypography = motion(Typography);
const AnimatedButton = motion(Button);
const AnimatedCard = motion(Card);

const FeatureCard = ({ icon, title, description }) => (
  <AnimatedCard 
    whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    sx={{ 
      height: '100%',
      borderRadius: 4,
      boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      border: '1px solid rgba(0,0,0,0.05)'
    }}
  >
    <CardContent sx={{ p: 3 }}>
      <Box 
        component={motion.div}
        animate={{ rotate: [0, 10, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        sx={{ 
          width: 60,
          height: 60,
          borderRadius: 2,
          bgcolor: 'primary.light',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 30, color: 'primary.main' } })}
      </Box>
      <Typography variant="h6" gutterBottom fontWeight={600}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </AnimatedCard>
);

const TestimonialCard = ({ name, role, content, avatar }) => (
  <AnimatedCard
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    sx={{
      p: 3,
      borderRadius: 4,
      height: '100%',
      background: 'rgba(255,255,255,0.7)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0,0,0,0.08)'
    }}
  >
    <FormatQuote sx={{ 
      fontSize: 40, 
      color: 'primary.light',
      transform: 'rotate(180deg)',
      mb: 1
    }} />
    <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic' }}>
      {content}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
      <Avatar 
        src={avatar} 
        sx={{ 
          width: 48, 
          height: 48,
          mr: 2,
          border: '2px solid',
          borderColor: 'primary.main'
        }} 
      />
      <Box>
        <Typography fontWeight={600}>{name}</Typography>
        <Typography variant="body2" color="text.secondary">{role}</Typography>
      </Box>
    </Box>
  </AnimatedCard>
);

const Front = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Dashboard />,
      title: "Real-time Dashboard",
      description: "Track all projects and tasks in one centralized view with live updates."
    },
    {
      icon: <Group />,
      title: "Team Collaboration",
      description: "Assign tasks, set priorities, and monitor team progress effortlessly."
    },
    {
      icon: <Task />,
      title: "Task Management",
      description: "Create, organize, and prioritize tasks with due dates and status tracking."
    },
    {
      icon: <TrendingUp />,
      title: "Progress Analytics",
      description: "Visual charts and reports to measure productivity and completion rates."
    },
    {
      icon: <Palette />,
      title: "Customizable Views",
      description: "Personalize your workspace with dark/light modes and layout preferences."
    },
    {
      icon: <MobileFriendly />,
      title: "Mobile Responsive",
      description: "Access your tasks anywhere with our fully responsive interface."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager at TechCorp",
      content: "This tool transformed our team's productivity. We've reduced missed deadlines by 40% since implementation.",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: "Michael Chen",
      role: "CTO at StartupHub",
      content: "The intuitive interface and powerful analytics helped us scale our development process seamlessly.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: "Emma Rodriguez",
      role: "Marketing Director",
      content: "Our cross-department collaboration improved dramatically thanks to the transparent task management system.",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg"
    }
  ];

  return (
    <>
      <CssBaseline />
      <AnimatedBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        sx={{ 
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          minHeight: '100vh',
          pt: 8
        }}
      >
        {/* Hero Section */}
        <Container maxWidth="lg">
          <Box sx={{ 
            textAlign: 'center',
            py: 10,
            px: { xs: 2, sm: 0 }
          }}>
            <AnimatedTypography
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              variant="h2" 
              component="h1" 
              fontWeight={800}
              sx={{ 
                mb: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Streamline Your Team's Productivity
            </AnimatedTypography>
            
            <AnimatedTypography
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              variant="h5" 
              component="p" 
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}
            >
              The ultimate task management solution for modern teams.
            </AnimatedTypography>
            
            <Stack 
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              direction="row" 
              spacing={2} 
              justifyContent="center"
            >
              <AnimatedButton
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                size="large"
                endIcon={<LockOpen />}
                onClick={() => navigate('/login')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)'
                }}
              >
                Get Started
              </AnimatedButton>
            </Stack>
          </Box>

          {/* Features Section */}
          <AnimatedBox
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            sx={{ py: 10 }}
          >
            <AnimatedTypography
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              variant="h4" 
              component="h2" 
              textAlign="center"
              fontWeight={700}
              sx={{ mb: 6 }}
            >
              Powerful Features
            </AnimatedTypography>
            
            <Grid container spacing={4}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <FeatureCard 
                    {...feature} 
                    transition={{ delay: index * 0.1 }}
                  />
                </Grid>
              ))}
            </Grid>
          </AnimatedBox>

          {/* Testimonials Section */}
          <AnimatedBox
            sx={{ py: 10, backgroundColor: 'rgba(0,0,0,0.02)', borderRadius: 4 }}
          >
            <Container maxWidth="lg">
              <AnimatedTypography
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                variant="h4"
                textAlign="center"
                fontWeight={700}
                sx={{ mb: 6 }}
              >
                What Others Say
              </AnimatedTypography>
              
              <Grid container spacing={4}>
                {testimonials.map((testimonial, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <TestimonialCard 
                      {...testimonial} 
                      transition={{ delay: index * 0.2 }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </AnimatedBox>

          {/* Final CTA */}
          <AnimatedBox
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            sx={{ textAlign: 'center', my: 10 }}
          >
            <Typography variant="h5" gutterBottom fontWeight={600}>
              Ready to get started?
            </Typography>
            <AnimatedButton
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              endIcon={<LockOpen />}
              onClick={() => navigate('/login')}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 3,
                fontWeight: 600,
                mt: 2
              }}
            >
              Login Now
            </AnimatedButton>
          </AnimatedBox>
        </Container>

        {/* Footer */}
        <AnimatedBox
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          sx={{ 
            py: 4,
            borderTop: '1px solid rgba(0,0,0,0.08)',
            textAlign: 'center'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} TaskTracker. All rights reserved.
          </Typography>
        </AnimatedBox>
      </AnimatedBox>
    </>
  );
};

export default Front;