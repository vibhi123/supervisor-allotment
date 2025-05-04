import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const StudentViewCard = ({ students, loading, handleRowClick }) => {
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
            <TableCell><strong>Supervisor</strong></TableCell>
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
                {student?.supervisor[0]?.fullName}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StudentViewCard;
