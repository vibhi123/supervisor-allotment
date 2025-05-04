import React from 'react';
import { Button, TextField, Typography, Box, CircularProgress } from '@mui/material';

function LoginForm({ formData, onChange, onSubmit, loading }) {
  return (
    <Box component="form" onSubmit={onSubmit} sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      
      <TextField
        fullWidth
        margin="normal"
        label="Email / Registration Number"
        name="identifier"
        value={formData.identifier}
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

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
    </Box>
  );
}

export default LoginForm;
