import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import { Link } from 'react-router-dom';

const AllotmentMTech = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/faculty/all-faculty');
        if (response.status === 200) {
          setFaculties(response.data.data);
        } else {
          toast.error('Failed to fetch faculty data');
        }
      } catch (error) {
        toast.error('An error occurred while fetching data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculties();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Toaster />
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
        M.Tech Allotment
      </Typography>
      {faculties.slice(0, 30).map((faculty) => (
        <Card
          key={faculty._id}
          sx={{
            mb: 2,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 200,
            width: '70%',
          }}
        >
          <Box flex={1} pr={2}>
            <Typography variant="h6">{faculty.fullName}</Typography>
            <Typography color="text.secondary">{faculty.designation}</Typography>
            <Typography variant="body2">
              Number of Students: {faculty.numberOfStudent}
            </Typography>
          </Box>

          <Box flex={1}>
            <Typography variant="subtitle1" fontWeight="bold">Students:</Typography>
            {faculty.student?.length > 0 ? (
              faculty.student.map((stu) => (
                <Box key={stu._id}>
                  <MuiLink
                    component={Link}
                    to={`/student/${stu.registrationNumber}`}
                    underline="hover"
                  >
                    {stu.fullName} ({stu.registrationNumber})
                  </MuiLink>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">No student assigned</Typography>
            )}
          </Box>
        </Card>
      ))}
    </Box>
  );
};

export default AllotmentMTech;
