import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Container, Typography, Paper, CircularProgress, Chip, Box, Avatar, Grid, Button } from '@mui/material';
import FacultyPreferencesTable from '../../components/FacultyPreferencesTable';
import TeamCard from '../../components/TeamCard';
import { useAuth } from '../../redux/AuthContext';

const StudentProfilePage = () => {
  const { registrationNumber } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/student/${registrationNumber}`, { withCredentials: true });
        setStudent(response.data.data);
        toast.success('Student profile loaded!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load student profile');
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [registrationNumber]);

  if (loading) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!student) {
    return (
      <Container sx={{ mt: 10, textAlign: 'center' }}>
        <Typography variant="h6">Student not found.</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 5 }}>
      <Grid container spacing={4}>
        <Grid size={6}>
          <Paper elevation={3} sx={{ p: 4, height: '85%' }}>
            <Box display="flex" alignItems="center" flexDirection="column">
              <Avatar src={student.profileImage || '../../assets/defaultProfilePicture.png'} sx={{ width: 120, height: 120, mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                {student.fullName}
              </Typography>
              {user?.role === "Admin" && !student.isVerified ? (
                <Box display="flex" gap={2} sx={{ mb: 2 }}>
                  <Chip
                    label={student.isVerified ? 'Verified' : 'Not Verified'}
                    color={student.isVerified ? 'success' : 'error'}
                    variant="outlined"
                  />
                  <Box display="flex" gap={1}>
                    <button
                      onClick={async () => {
                        try {
                          await axios.put(
                            `http://localhost:8000/api/v1/admin/verify/${registrationNumber}`,
                            { isVerified: true },
                            { withCredentials: true }
                          );
                          setStudent((prev) => ({ ...prev, isVerified: true }));
                          toast.success("Student verified");
                        } catch (err) {
                          console.error(err);
                          toast.error("Verification failed");
                        }
                      }}
                    >
                      ✅ Verify
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await axios.put(
                            `http://localhost:8000/api/v1/student/${registrationNumber}/verify`,
                            { isVerified: false },
                            { withCredentials: true }
                          );
                          setStudent((prev) => ({ ...prev, isVerified: false }));
                          toast.success("Student marked as not verified");
                        } catch (err) {
                          console.error(err);
                          toast.error("Update failed");
                        }
                      }}
                    >
                      ❌ Reject
                    </button>
                  </Box>
                </Box>
              ) : (
                <Chip
                  label={student.isVerified ? 'Verified' : 'Not Verified'}
                  color={student.isVerified ? 'success' : 'error'}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              )}

            </Box>
            <Box mt={2}>
              <Typography><strong>Registration Number:</strong> {student.registrationNumber}</Typography>
              <Typography><strong>Course:</strong> {student.course}</Typography>
              <Typography><strong>CPI:</strong> {student.cpi}</Typography>
              <Typography><strong>Rank:</strong> {student.rank}</Typography>

              {student.course === "M.Tech." && (
                <>
                  <Typography><strong>Gate Score:</strong> {student.gateScore}</Typography>
                  <Typography><strong>Date of Birth:</strong> {new Date(student.dateOfBirth).toLocaleDateString()}</Typography>
                  <Typography><strong>Gender:</strong> {student.gender}</Typography>
                  <Typography><strong>Interest:</strong> {student.interest}</Typography>
                  <Typography variant="h6" sx={{ mt: 3 }}>Supervisor:</Typography>
                  {student.supervisor.length > 0 ? (
                    <ul>
                      {student.supervisor.map((sup) => (
                        <li key={sup._id}>{sup.fullName}</li>
                      ))}
                    </ul>
                  ) : (
                    <Typography>No supervisor assigned</Typography>
                  )}
                </>
              )}

            </Box>
          </Paper>
        </Grid>

        <Grid item size={6}>
          <Paper elevation={3} sx={{ p: 4, height: '85%' }}>
            {student.course === "M.Tech." ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Faculty Preferences
                </Typography>
                {student.facultyPreferences.length > 0 ? (
                  <FacultyPreferencesTable preferences={student.facultyPreferences} />
                ) : (
                  <Typography>No preferences provided</Typography>
                )}
              </>
            ) : student.course === "MCA" ? (
              <>
                <Typography
                  variant="h5"
                  gutterBottom
                  textAlign="center"
                  fontWeight="bold"
                  color="primary.main"
                >
                  Team {student.team.teamNumber}
                </Typography>
                {student.team ? (
                  <TeamCard team={student.team} />
                ) : (
                  <Typography>No team assigned</Typography>
                )}
              </>
            ) : (
              <Typography>Course-specific details not available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentProfilePage;
