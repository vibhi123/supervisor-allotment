import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const FacultyPreferencesTable = ({ preferences }) => {
  console.log(preferences);
  
  return (
    <TableContainer component={Paper} sx={{ maxHeight: 500, overflowY: 'auto' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell><strong>S. No.</strong></TableCell>
            <TableCell><strong>Faculty Name</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {preferences.map((faculty, index) => (
            <TableRow key={faculty._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{faculty.fullName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
  
};


export default FacultyPreferencesTable;