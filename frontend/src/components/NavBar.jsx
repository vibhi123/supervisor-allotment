import React from "react";
import { AppBar, Toolbar, Typography, Button, Avatar, IconButton, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import { useAuth } from "../redux/AuthContext";

const NavBar = () => {
  const {user, setUser} = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const cookies = new Cookies();
    try {
      await axios.post(
        "http://localhost:8000/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );
      cookies.remove("accessToken");
      cookies.remove("refreshToken");
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <AppBar position="sticky" color="primary">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Left side - Back Button + (optional user info) */}
        <Box display="flex" alignItems="center">
          <IconButton color="inherit" onClick={handleBack}>
            <ArrowBackIcon />
          </IconButton>

          {user && (
            <Box display="flex" alignItems="center" ml={2}>
              <Avatar src={user.profileImage} alt={user.fullName} sx={{ width: 32, height: 32, mr: 1 }} />
              <Typography variant="subtitle1">{user.fullName}</Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: "center" }}>
          MNNIT Allahabad
        </Typography>

        {user ? (
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={handleLogin}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
