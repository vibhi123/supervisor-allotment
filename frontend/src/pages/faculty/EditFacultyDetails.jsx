import React, { useEffect, useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    CircularProgress,
    MenuItem,
    Paper
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const EditFacultyDetails = () => {
    const { facultyId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        designation: '',
        numberOfStudent: '',
        interest: '',
        areaOfResearch: []
    });

    const [loading, setLoading] = useState(false);

    const designations = [
        'Professor',
        'Associate Professor',
        'Assistant Professor - 8000',
        'Assistant Professor - 7000'
    ];
    const interests = ['Research', 'Internship', 'Any'];

    const fetchFacultyDetails = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`http://localhost:8000/api/v1/faculty/${facultyId}`, {
                withCredentials: true
            });

            const faculty = res.data?.data;
            setFormData({
                fullName: faculty.fullName,
                email: faculty.email,
                designation: faculty.designation,
                numberOfStudent: faculty.numberOfStudent,
                interest: faculty.interest,
                areaOfResearch: faculty.areaOfResearch
            });
        } catch (err) {
            toast.error('Failed to fetch faculty details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFacultyDetails();
    }, [facultyId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { designation, numberOfStudent, interest, areaOfResearch } = formData;

        if (
            [designation, numberOfStudent, interest].some(
              (field) => typeof field === 'string' ? field.trim() === '' : false
            ) ||
            (interest === 'Research' &&
              (typeof areaOfResearch === 'string'
                ? areaOfResearch.trim() === ''
                : areaOfResearch.length === 0))
          ) {
            toast.error('Please fill all required fields');
            return;
          }          

        try {
            setLoading(true);
            await axios.put(
                `http://localhost:8000/api/v1/admin/update-faculty/${facultyId}`,
                {
                    designation,
                    numberOfStudent,
                    interest,
                    areaOfResearch: typeof areaOfResearch === 'string'
                        ? areaOfResearch.split(',').map((item) => item.trim())
                        : areaOfResearch
                },
                { withCredentials: true }
            );
            toast.success('Faculty updated successfully');
            navigate('/faculty-all');
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={4} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom align="center" color="primary">
                    Edit Faculty Details
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            disabled
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            disabled
                            margin="normal"
                        />
                        <TextField
                            select
                            fullWidth
                            label="Designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            margin="normal"
                            required
                        >
                            {designations.map((des) => (
                                <MenuItem key={des} value={des}>
                                    {des}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Number of Students"
                            name="numberOfStudent"
                            type="number"
                            value={formData.numberOfStudent}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            select
                            fullWidth
                            label="Interest"
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            margin="normal"
                            required
                        >
                            {interests.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        {formData.interest === 'Research' && (
                            <TextField
                                fullWidth
                                label="Area of Research (comma-separated)"
                                name="areaOfResearch"
                                value={
                                    Array.isArray(formData.areaOfResearch)
                                        ? formData.areaOfResearch.join(', ')
                                        : formData.areaOfResearch
                                }
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        areaOfResearch: e.target.value
                                    }))
                                }
                                margin="normal"
                                required
                            />
                        )}


                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            color="primary"
                            sx={{ mt: 2 }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Faculty'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default EditFacultyDetails;