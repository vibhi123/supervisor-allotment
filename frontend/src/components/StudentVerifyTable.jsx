import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const StudentVerifyTable = ({ students, loading, handleRowClick }) => {
  if (loading) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Registration Number</strong></TableCell>
            <TableCell><strong>Full Name</strong></TableCell>
            <TableCell><strong>Course</strong></TableCell>
            <TableCell><strong>Verified</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student, index) => (
            <TableRow
              key={index}
              hover
              style={{ cursor: 'pointer' }}
              onClick={() => handleRowClick(student.registrationNumber)}
            >
              <TableCell>{student.registrationNumber}</TableCell>
              <TableCell>{student.fullName}</TableCell>
              <TableCell>{student.course}</TableCell>
              <TableCell>
                <Chip 
                  label={student.isVerified ? 'Verified' : 'Not Verified'} 
                  color={student.isVerified ? 'success' : 'error'} 
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentVerifyTable;
