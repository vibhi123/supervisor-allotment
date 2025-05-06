import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const AddAdmin = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, password } = formData;

    if (!email.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:8000/api/v1/admin/addAdmin',
        { fullName, email, password },
        { withCredentials: true }
      );
      toast.success(response.data?.message || "Admin added successfully");
      setFormData({ fullName: '', email: '', password: '' });
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to add admin";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom align="center" color="primary">
          Add New Admin
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Admin'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddAdmin;
