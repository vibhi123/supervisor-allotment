import React, { useEffect } from 'react';
import { Button, Box, Typography, Grid, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../redux/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const {user} = useAuth();
  const buttonSx = {
    bgcolor: '#1976d2',
    '&:hover': { bgcolor: '#115293' },
    width: '70%',
  };

  useEffect(() => {
    if (!(user?.role === 'Admin')) {
      navigate("/unauthorized");
    }
  }, [user, navigate]);

  const {
    MCATeamsCreated,
    MCAFacultyAllotted,
    MTechFacultyAllotted,
    MCARankGenerated,
    MTechRankGenerated
  } = user || {};
  // console.log(MCATeamsCreated);
  

  const MCASection = () => (
    <Paper elevation={4} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 4, height: '100%' }}>
      <Stack spacing={3} alignItems="center" height="100%" justifyContent="flex-start">
        <Typography variant="h5" color="primary" gutterBottom>
          MCA
        </Typography>
        <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#1976d2' }} onClick={() => navigate('/mca-all')}>View All Students</Button>
        <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#388e3c' }} onClick={() => navigate('/admin/verify-mca')}>Verify Students</Button>

        {MCARankGenerated ? (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#7b1fa2' }} onClick={() => navigate('/mca-ranklist')}>View Ranklist</Button>
        ) : (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#7b1fa2' }} onClick={() => navigate('/mca/create-teams')}>Create Ranklist</Button>
        )}
  
        {MCATeamsCreated ? (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#7b1fa2' }} onClick={() => navigate('/admin/teams-mca')}>View Teams</Button>
        ) : (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#7b1fa2' }} onClick={() => navigate('/mca/create-teams')} disabled={!MCARankGenerated}>Create Teams</Button>
        )}
  
        {MCAFacultyAllotted ? (
          <>
            <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#0288d1' }} onClick={() => navigate('/mca-allotment')}>View Allotment</Button>
            <Button variant="contained" color="error" sx={buttonSx} onClick={() => navigate('/mca/reset-allotment')}>Reset Allotment</Button>
          </>
        ) : (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#0288d1' }} onClick={() => navigate('/mca/allot-faculty')} disabled={!MCATeamsCreated}>Allot Faculty</Button>
        )}
      </Stack>
    </Paper>
  );
  

  const MTechSection = () => (
    <Paper elevation={4} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 4, height: '100%' }}>
      <Stack spacing={3} alignItems="center" height="100%" justifyContent="flex-start">
        <Typography variant="h5" color="primary" gutterBottom>
          MTech
        </Typography>
        <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#1976d2' }} onClick={() => navigate('/mtech-all')}>View All Students</Button>
        <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#388e3c' }} onClick={() => navigate('/admin/verify-mtech')}>Verify Students</Button>

        {MTechRankGenerated ? (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#7b1fa2' }} onClick={() => navigate('/mtech-ranklist')}>View Ranklist</Button>
        ) : (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#7b1fa2' }} onClick={() => navigate('/mca/create-teams')}>Create Ranklist</Button>
        )}
  
        {MTechFacultyAllotted ? (
          <>
            <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#f9a825' }} onClick={() => navigate('/mtech-allotment')}>View Allotment</Button>
            <Button variant="contained" color="error" sx={buttonSx} onClick={() => navigate('/mtech/reset-allotment')}>Reset Allotment</Button>
          </>
        ) : (
          <Button variant="contained" sx={{ ...buttonSx, bgcolor: '#0288d1' }} onClick={() => navigate('/mtech/allot-faculty')}>Allot Faculty</Button>
        )}
      </Stack>
    </Paper>
  );
  

  const FacultySection = () => (
    <Paper elevation={4} sx={{ p: 3, bgcolor: '#f5f5f5', borderRadius: 4, height: '100%' }}>
      <Stack spacing={3} alignItems="center" height="100%" justifyContent="flex-start">
        <Typography variant="h5" color="primary" gutterBottom>
          Faculty
        </Typography>
  
        <Button
          variant="contained"
          sx={{ ...buttonSx, bgcolor: '#1976d2', '&:hover': { bgcolor: '#115293' } }}
          onClick={() => navigate('/faculty-all')}
        >
          View Faculty Details
        </Button>
  
        <Button
          variant="contained"
          sx={{ ...buttonSx, bgcolor: '#388e3c', '&:hover': { bgcolor: '#2e7d32' } }}
          onClick={() => navigate('/mtech/view-allotment')}
          disabled={!MTechFacultyAllotted}
        >
          View MTech Allotment
        </Button>
  
        <Button
          variant="contained"
          sx={{ ...buttonSx, bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
          onClick={() => navigate('/allotment-mca')}
          disabled={!MCAFacultyAllotted}
        >
          View MCA Allotment
        </Button>
      </Stack>
    </Paper>
  );  

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      p={4}
    >
      <Typography variant="h4" color="primary" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid display="flex" flexDirection="row" alignItems="center" justifyContent="space-around" container spacing={4} mt={3} width={"100vw"}>
        <Grid item size={3.5} sm={12} md={4} sx={{ height: '65vh' }}>
          {MCASection()}
        </Grid>
        <Grid item size={3.5} sm={12} md={4} sx={{ height: '65vh' }}>
          {MTechSection()}
        </Grid>
        <Grid item size={3.5} sm={12} md={4} sx={{ height: '65vh' }}>
          {FacultySection()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
