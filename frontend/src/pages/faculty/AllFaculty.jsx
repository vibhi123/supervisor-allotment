import React, { useEffect, useState } from "react";
import { Box, Typography, Divider, Paper, Grid, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import DefaultLimitDialog from "../../components/DefaultLimitDialog";
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';

const AllFacultyPage = () => {
  const [faculties, setFaculties] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [limits, setLimits] = useState({
    Professor: 1,
    'Associate Professor': 2,
    'Assistant Professor - 8000': 2,
    'Assistant Professor - 7000': 3
  });

  const handleSave = () => {
    toast.success('Updated !');
    console.log('Updated Limits:', limits);
    setOpen(false);
  };

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/admin/allFaculty",
          { withCredentials: true }
        );
        setFaculties(response.data.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to fetch faculties");
      }
    };
    fetchFaculties();
  }, []);

  return (
    <Box p={3} maxWidth="1000px" mx="auto">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h4" fontWeight="bold">
          Faculty List
        </Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          Set Default Limits
        </Button>
      </Box>

      <DefaultLimitDialog
        open={open}
        onClose={() => setOpen(false)}
        limits={limits}
        setLimits={setLimits}
        onSave={handleSave}
      />

      <Grid container direction="column" spacing={3}>
        {faculties.map((faculty) => (
          <Grid item key={faculty._id}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid #e0e0e0",
                backgroundColor: "#fafafa",
              }}
            >
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    {faculty.fullName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {faculty.designation}
                  </Typography>
                </Box>
                <IconButton
                  color="primary"
                  onClick={() => navigate(`/admin/edit-faculty/${faculty._id}`)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
              </Box>


              <Grid container spacing={2}>
                <Grid size={6} item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    M.Tech. Students
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={1}>
                    {faculty.student.length > 0 ? (
                      faculty.student.map((stu) => (
                        <Typography
                          key={stu._id}
                          variant="body2"
                          sx={{
                            cursor: "pointer",
                            "&:hover": { textDecoration: "underline", color: "primary.main" },
                          }}
                          onClick={() => navigate(`/student/${stu.registrationNumber}`)}
                        >
                          {stu.fullName} ({stu.registrationNumber})
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No students assigned
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid size={6} item xs={12} md={6}>
                  {faculty.team ? (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                          cursor: "pointer",
                          width: "fit-content",
                          "&:hover": { textDecoration: "underline", color: "secondary.main" },
                        }}
                        onClick={() => navigate(`/admin/team-mca/${faculty.team.teamNumber}`)}
                        gutterBottom
                      >
                        MCA Team #{faculty.team.teamNumber}
                      </Typography>

                      <Box display="flex" flexDirection="column" gap={1}>
                        {faculty.team.members.map((member) => (
                          <Typography
                            key={member._id}
                            variant="body2"
                            sx={{
                              cursor: "pointer",
                              "&:hover": { textDecoration: "underline", color: "primary.main" },
                            }}
                            onClick={() => navigate(`/student/${member.registrationNumber}`)}
                          >
                            {member.fullName} ({member.registrationNumber})
                          </Typography>
                        ))}
                      </Box>
                    </>
                  ) : (
                    <Typography variant="subtitle1" color="text.secondary">
                      No team assigned
                    </Typography>
                  )}
                </Grid>

              </Grid>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AllFacultyPage;
