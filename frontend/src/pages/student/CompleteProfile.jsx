import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Box,
} from '@mui/material';
import { useAuth } from '../../redux/AuthContext';

const branches = ['DS', 'AI-ML', 'CS'];
const interests = ['Internship', 'Research'];

export default function StudentProfileForm() {
  const {user, setUser} = useAuth();
  const [formData, setFormData] = useState({
    branch: '',
    dateOfBirth: '',
    gateScore: '',
    interest: '',
    areasOfResearch: '',
    gender: '',
    gateScoreCard: null,
  });

  const [pdfPreview, setPdfPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prev) => ({ ...prev, gateScoreCard: file }));
      setPdfPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { branch, dateOfBirth, gateScore, interest, areasOfResearch, gender, gateScoreCard } = formData;

    if (!branch || !dateOfBirth || !gateScore || !interest || !gender || !gateScoreCard) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (interest === 'Research' && !areasOfResearch.trim()) {
      toast.error("Please provide your areas of research.");
      return;
    }

    const data = new FormData();
    data.append('branch', branch);
    data.append('dateOfBirth', dateOfBirth);
    data.append('gateScore', gateScore);
    data.append('interest', interest);
    if (interest === 'Research') {
      data.append('areasOfResearch', areasOfResearch);
    }
    data.append('gender', gender);
    data.append('gateScoreCard', gateScoreCard);

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:8000/api/v1/student/complete-profile',
        data,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      toast.success("Profile submitted successfully!");
      navigate('/mtech/fill-faculty-preference');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to submit profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Complete Student Profile
      </Typography>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={user?.fullName || ''}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={user?.email || ''}
          InputProps={{ readOnly: true }}
        />

        <TextField
          label="Registration Number"
          fullWidth
          margin="normal"
          value={user?.registrationNumber || ''}
          InputProps={{ readOnly: true }}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Branch</InputLabel>
          <Select name="branch" value={formData.branch} onChange={handleChange} required>
            {branches.map((b) => (
              <MenuItem key={b} value={b}>{b}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Date of Birth"
          type="date"
          name="dateOfBirth"
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <TextField
          label="GATE Score"
          type="number"
          name="gateScore"
          fullWidth
          margin="normal"
          value={formData.gateScore}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Interest</InputLabel>
          <Select name="interest" value={formData.interest} onChange={handleChange} required>
            {interests.map((i) => (
              <MenuItem key={i} value={i}>{i}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {formData.interest === 'Research' && (
          <TextField
            label="Areas of Research (comma separated)"
            name="areasOfResearch"
            fullWidth
            margin="normal"
            value={formData.areasOfResearch}
            onChange={handleChange}
            required
          />
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select name="gender" value={formData.gender} onChange={handleChange} required>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <Box mt={2}>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          {pdfPreview && (
            <Box mt={2}>
              <Typography variant="subtitle1">PDF Preview:</Typography>
              <iframe
                src={pdfPreview}
                title="PDF Preview"
                width="100%"
                height="400px"
              />
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Profile'}
        </Button>
      </form>
    </Container>
  );
}
