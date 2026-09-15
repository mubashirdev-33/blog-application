import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ArticleIcon from '@mui/icons-material/Article';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate add kiya redirect ke liye
import { signOut } from "firebase/auth";
import { toast, ToastContainer } from 'react-toastify';
import { auth } from '../firebase/config.js';
const pages = [
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" }
];

function Navbar({userimg}) {
  // 1. FIXED: States ko function se nikal kar top-level par rakha
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const logoutHandler = async() => {
    
    
    handleCloseUserMenu();
    //  Firebase auth.signOut()
try {
     const userLogout =await signOut(auth)
    toast.success("User signed out successfully");
} catch (error) {
  console.log(error.message);
  
}
    
  
    navigate('/login'); 
  };

  
  const settings = [
    { name: "Profile", handler: () => { handleCloseUserMenu(); navigate('/profile'); } },
    { name: "Account", handler: () => { handleCloseUserMenu(); } },
    { name: "Dashboard", handler: () => { handleCloseUserMenu(); } },
    { name: "Logout", handler: logoutHandler }, 
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#4f46e5' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          {/* Desktop Blog Logo */}
          <ArticleIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'white', fontSize: 32 }} />

          <Typography
            variant="h6"
            noWrap
            component={Link} 
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            BLOG
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              sx={{ color: 'white' }}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  component={Link} 
                  to={page.url} 
                  onClick={handleCloseNavMenu}
                >
                  <Typography sx={{ textAlign: 'center' }}>{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Blog Logo */}
          <ArticleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: 'white', fontSize: 30 }} />

          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            BLOG
          </Typography>

          {/* Desktop Navigation Links */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                to={page.url}
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'white',
                  display: 'block',
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Right Side Buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Button
              component={Link}
              to="/adminlogin"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                textTransform: 'none',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.12)' },
              }}
            >
              Admin
            </Button>

            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: 'white',
                textTransform: 'none',
                '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255, 255, 255, 0.12)' },
              }}
            >
              Login
            </Button>

            <Button
              component={Link}
              to="/signup"
              variant="contained"
              sx={{
                color: '#4f46e5',
                backgroundColor: 'white',
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#f3f4f6' },
              }}
            >
              Signup
            </Button>
          </Box>

          {/* Profile Dropdown Menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User Avatar" src={userimg} />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.name} onClick={setting.handler}>
                  <Typography sx={{ textAlign: 'center' }}>{setting.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

        </Toolbar>
      </Container>
      <ToastContainer/>
    </AppBar>
  );
}

export default Navbar;
