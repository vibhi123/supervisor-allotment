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

const AddFaculty = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        designation: '',
        numberOfStudent: '',
        interest: '',
        areaOfResearch: ''
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const designations = [
        'Professor',
        'Associate Professor',
        'Assistant Professor - 7000',
        'Assistant Professor - 8000'
    ];

    const interests = ['Research', 'Internship', 'Any'];

    const defaultStudentCounts = {
        'Professor': 1,
        'Associate Professor': 2,
        'Assistant Professor - 7000': 2,
        'Assistant Professor - 8000': 3
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Auto-set numberOfStudent when designation changes
        if (name === 'designation') {
            const defaultCount = defaultStudentCounts[value] ?? 1;
            setFormData((prev) => ({
                ...prev,
                designation: value,
                numberOfStudent: defaultCount
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {
            fullName,
            email,
            password,
            designation,
            numberOfStudent,
            interest,
            areaOfResearch
        } = formData;

        if (
            [fullName, email, password, designation, interest].some(
                (field) => field.trim() === ''
            ) || (interest === 'Research' && areaOfResearch.trim() === '')            
        ) {
            toast.error("All fields are required");
            return;
        }

        const apiDesignation = designation.startsWith("Assistant Professor")
            ? "Assistant Professor"
            : designation.startsWith("Associate Professor")
            ? "Assosiate Professor"
            : designation;

        try {
            setLoading(true);
            const response = await axios.post(
                'http://localhost:8000/api/v1/admin/addFaculty',
                {
                    fullName,
                    email,
                    password,
                    designation: apiDesignation,
                    numberOfStudent: Number(numberOfStudent),
                    interest,
                    areaOfResearch: areaOfResearch.split(',').map(str => str.trim())
                },
                { withCredentials: true }
            );
            toast.success(response.data?.message || 'Faculty added successfully');
            navigate('/admin/dashboard');
            setFormData({
                fullName: '',
                email: '',
                password: '',
                designation: '',
                numberOfStudent: '',
                interest: '',
                areaOfResearch: ''
            });
        } catch (error) {
            const message = error?.response?.data?.message || 'Failed to add faculty';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5 }}>
            <Paper elevation={4} sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom align="center" color="primary">
                    Add New Faculty
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
                            value={formData.areaOfResearch}
                            onChange={handleChange}
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
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Faculty'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default AddFaculty;