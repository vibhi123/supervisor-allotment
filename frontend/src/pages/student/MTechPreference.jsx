import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FacultyPreferenceSelector from '../../components/FacultyPreferenceSelector';
import { Container, CircularProgress, Alert } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const MTechPreference = () => {
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8000/api/v1/faculty/all-faculty')
      .then((res) => {
        setFaculties(res.data);
        setLoading(false);
        toast.success("Preferences submitted successfully")
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        toast.error("Preference submit failed")
      });
  }, []);

  
  const handlePreferenceSubmit = async (preferenceIds) => {
        // console.log(preferenceIds);
        try {
          const res = await axios.post('http://localhost:8000/api/v1/student/submit-preferences',
            {preferenceIds: preferenceIds},
          {
            withCredentials: true
          });
          
          toast.success("Preferences submitted successfully");
          navigate(`/student/${res.data.data.registrationNumber}`);
        } catch (error) {
          console.error(error);
        }
    };

  if (loading) return <Container><CircularProgress /></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <FacultyPreferenceSelector faculties={faculties} onSubmit={handlePreferenceSubmit} />
    </Container>
  );
};

export default MTechPreference;
