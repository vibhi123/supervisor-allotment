import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Paper,
    Typography,
    Box,
    CircularProgress,
    MenuItem
} from '@mui/material';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        registrationNumber: '',
        course: '',
        cpi: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const courses = ['M.Tech.', 'MCA'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            fullName,
            email,
            password,
            registrationNumber,
            course,
            cpi
        } = formData;

        if (
            [fullName, email, password, registrationNumber, course, cpi].some(
                (field) => field.trim() === ''
            )
        ) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);
            const response = await axios.post(
                'http://localhost:8000/api/v1/admin/addStudent',
                {
                    fullName,
                    email,
                    password,
                    registrationNumber,
                    course,
                    cpi
                },
                { withCredentials: true }
            );
            toast.success(response.data?.message || 'Student added successfully');
            navigate('/admin/dashboard');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                registrationNumber: '',
                course: '',
                cpi: ''
            });
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to add student';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={4} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom align="center" color="primary">
                    Add New Student
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        fullWidth
                        label="Full Name"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Registration Number"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        select
                        fullWidth
                        label="Course"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        margin="normal"
                        required
                    >
                        {courses.map((course) => (
                            <MenuItem key={course} value={course}>
                                {course}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="CPI"
                        name="cpi"
                        type="number"
                        value={formData.cpi}
                        onChange={handleChange}
                        margin="normal"
                        required
                        inputProps={{ step: '0.01', min: 0, max: 10 }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        color="primary"
                        sx={{ mt: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Student'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddStudent;