import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from '@mui/material';

const MCATeams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/v1/admin/allMCATeams', {
          withCredentials: true,
        });
        setTeams(res.data.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleRowClick = (teamNumber) => {
    navigate(`/admin/team-mca/${teamNumber}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        MCA Teams
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Team Number</strong></TableCell>
            <TableCell><strong>Member 1</strong></TableCell>
            <TableCell><strong>Member 2</strong></TableCell>
            <TableCell><strong>Member 3</strong></TableCell>
            <TableCell><strong>Member 4</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teams.map((team) => (
            <TableRow
              key={team.teamNumber}
              hover
              sx={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(team.teamNumber)}
            >
              <TableCell>{team.teamNumber}</TableCell>
              {Array.from({ length: 4 }).map((_, idx) => (
                <TableCell key={idx}>
                  {team.members[idx] ? team.members[idx].fullName : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MCATeams;