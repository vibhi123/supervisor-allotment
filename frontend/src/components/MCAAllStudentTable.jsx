import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const MCAAllStudentTable = ({ students, loading, handleRowClick }) => {
  if (loading) {
    return null;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>S.No.</strong></TableCell>
            <TableCell><strong>Registration Number</strong></TableCell>
            <TableCell><strong>Full Name</strong></TableCell>
            <TableCell><strong>CPI</strong></TableCell>
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
              <TableCell>{index + 1}</TableCell>
              <TableCell>{student.registrationNumber}</TableCell>
              <TableCell>{student.fullName}</TableCell>
              <TableCell>{student.cpi}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MCAAllStudentTable;
