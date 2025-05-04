import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import StudentViewCard from '../../components/StudentViewCard';

const MTechAllotment = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/common/allMTech');
        console.log(response);
        
        setStudents(response.data.data);
        toast.success('Students loaded successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load students');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleRowClick = (registrationNumber) => {
    navigate(`/student/${registrationNumber}`);
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>
        M.Tech Students
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <StudentViewCard
          students={students}
          loading={loading}
          handleRowClick={handleRowClick}
        />
      )}
    </Container>
  );
};

export default MTechAllotment;
