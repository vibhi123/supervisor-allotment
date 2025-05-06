import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress } from '@mui/material';
import MCAAllStudentTable from '../../components/MCAAllStudentTable';

const MCAAllStudent = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/common/allMCAReg');
        setStudents(response.data.data);
        toast.success('MCA students loaded successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Failed to load MCA students');
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
        MCA Students
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <MCAAllStudentTable
          students={students}
          loading={loading}
          handleRowClick={handleRowClick}
        />
      )}
    </Container>
  );
};

export default MCAAllStudent;
