import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Typography, Grid, Paper } from '@mui/material';
import FacultyPreferencesTable from '../../components/FacultyPreferencesTable';
import TeamCard from '../../components/TeamCard';
import toast from 'react-hot-toast';

const MCATeam = () => {
  const { teamNumber } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/admin/teamMCA/${teamNumber}`, {
          withCredentials: true,
        });
        console.log(response);
        
        setTeam(response.data.data);
      } catch (err) {
        toast.error("Failed to load team data")
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamNumber]);

  // if (loading) {
  //   toast.loading("Loading...")
  // }

  if (error) {
    return (
      toast.error("Error")
    );
  }

  if (!team) {
    return null;
  }

  return (
    <Box p={4}>
      <Grid container spacing={4}>
      <Grid size={6}>
          <Paper elevation={3} sx={{ p: 4, height: '90%' }}>

            <Typography
        variant="h5"
        gutterBottom
        textAlign="center"
        fontWeight="bold"
        color="primary.main"
      >
        Team {team.teamNumber}
      </Typography>
            <TeamCard team={team} />
          </Paper>
        </Grid>
          <Grid size={6}>
          <Paper elevation={3} sx={{ p: 4, height: '90%' }}>
            <Typography variant="h6" gutterBottom>
              Faculty Preferences
            </Typography>
          <FacultyPreferencesTable preferences={team.facultyPreferences} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MCATeam;
