import React from 'react';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';

function RegisterForm({ formData, onChange, onImageChange, onSubmit, loading }) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Register</Typography>

      <TextField
        fullWidth
        margin="normal"
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={onChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        value={formData.email}
        onChange={onChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Registration Number"
        name="registrationNumber"
        value={formData.registrationNumber}
        onChange={onChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Course"
        name="course"
        value={formData.course}
        onChange={onChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="CPI"
        name="cpi"
        value={formData.cpi}
        onChange={onChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Password"
        type="password"
        name="password"
        value={formData.password}
        onChange={onChange}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={onChange}
      />

      <Button
        variant="outlined"
        component="label"
        sx={{ mt: 2 }}
      >
        Upload Profile Image
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={onImageChange}
        />
      </Button>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Register'}
      </Button>
    </Box>
  );
}

export default RegisterForm;
