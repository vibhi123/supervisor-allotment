import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Avatar,
} from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { useAuth } from '../../redux/AuthContext';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    identifier: '',
    registrationNumber: '',
    confirmPassword: '',
    fullName: '',
    course: '',
    cpi: '',
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {setUser} = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
  
      setFormData(prevData => ({
        ...prevData,
        profileImage: file
      }));
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password, registrationNumber, confirmPassword, fullName, course, cpi, profileImage, identifier } = formData;
    const trimmedEmail = email.trim();
    const trimmedReg = registrationNumber.trim();
    const trimmedIdentifier = identifier.trim();
  
    if ((isLogin && !trimmedIdentifier) || !password || (!isLogin && (!fullName || !course || !cpi))) {
      toast.error("Please fill in all required fields");
      return;
    }
  
    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      setLoading(true);
  
      if (isLogin) {
        const res = await axios.post("http://localhost:8000/api/v1/auth/login", { email: trimmedIdentifier, registrationNumber: trimmedIdentifier, password });
        // console.log(res.data);
        
        const cookies = new Cookies();
        cookies.remove("accessToken");
        cookies.remove("refreshToken");
        cookies.set("accessToken", res.data.data.accessToken);
        cookies.set("refreshToken", res.data.data.refreshToken);
        setUser(res.data.data.user);
        toast.success("Login successful!");
        // console.log(res.data.data.user.course);
        
        if (res.data.data.user.role === "Admin") {
          navigate("/admin/dashboard");
        } else if (res.data.data.user.role === "Faculty") {
          navigate("/dashboard/faculty");
        } else if (res.data.data.user.course === "MCA") {
          navigate(`/student/${res.data.data.user.registrationNumber}`);
        } else if (res.data.data.user.course === "M.Tech.") {
          if (res.data.data.user.filledDetails) {
            if (res.data.data.user.filledPreferences) {
              navigate(`/student/${res.data.data.user.registrationNumber}`);
            } else {
              navigate("/mtech/fill-faculty-preference");
            }
          } else {
            navigate("/student/complete-profile");
          }
        }
      } else {
        const formData = new FormData();
        formData.append('email', trimmedEmail);
        formData.append('password', password);
        formData.append('registrationNumber', trimmedReg);
        formData.append('fullName', fullName);
        formData.append('course', course);
        formData.append('cpi', cpi);
  
        // Append the actual file here
        if (profileImage) formData.append('profileImage', profileImage);
  
        console.log(formData); // Check if the file is properly appended
  
        const res = await axios.post("http://localhost:8000/api/v1/student/register", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 8 }}>
        <Typography variant="h5" gutterBottom>{isLogin ? 'Login' : 'Register'}</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <TextField
                margin="normal"
                fullWidth
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                value={formData.fullName}
                required
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Course</InputLabel>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                >
                  <MenuItem value="M.Tech.">M.Tech.</MenuItem>
                  <MenuItem value="MCA">MCA</MenuItem>
                </Select>
              </FormControl>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Registration Number"
                  name="registrationNumber"
                  onChange={handleChange}
                  value={formData.registrationNumber}
                  required
                />
              <TextField
                margin="normal"
                fullWidth
                label="CPI"
                name="cpi"
                type="number"
                onChange={handleChange}
                value={formData.cpi}
                required
              />
              <TextField
                margin="normal"
                fullWidth
                label="Email"
                name="email"
                type="email"
                onChange={handleChange}
                value={formData.email}
                required
              />
            </>
          )}

          {isLogin && (
            <TextField
              margin="normal"
              fullWidth
              label="Email / Registration Number"
              name="identifier"
              onChange={handleChange}
              value={formData.identifier}
              required
            />
          )}

          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            value={formData.password}
            required
          />

          {!isLogin && (
            <TextField
              margin="normal"
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
          )}

          {!isLogin && (
            <Box mt={2} mb={2}>
              <Button variant="outlined" component="label" fullWidth>
                Upload Profile Image
                <input type="file" hidden onChange={handleImageChange} accept="image/*" />
              </Button>
              {imagePreview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <Avatar src={imagePreview} sx={{ width: 100, height: 100 }} />
                </Box>
              )}
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : isLogin ? 'Login' : 'Register'}
          </Button>

          <Box mt={2}>
            <Typography variant="body2">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
              <Link
                component="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsLogin(!isLogin);
                }}
              >
                {isLogin ? 'Register' : 'Login'}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default AuthPage;
