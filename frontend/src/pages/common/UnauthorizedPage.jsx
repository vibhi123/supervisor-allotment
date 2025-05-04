import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-2);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f5f5f5"
      p={4}
    >
      <Typography variant="h2" color="error" gutterBottom>
        401
      </Typography>
      <Typography variant="h5" gutterBottom>
        Unauthorized Access
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleGoBack}>
        Go Back
      </Button>
    </Box>
  );
};

export default UnauthorizedPage;