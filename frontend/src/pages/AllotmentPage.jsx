import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AllotmentPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/admin/allotment')
      .then(res => setStudents(res.data))
      .catch(err => console.error('Failed to load data', err));
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Allotment Results</h1>
      <table className="w-full border shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Rank</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">CPI</th>
            <th className="p-3 text-left">GATE Score</th>
            <th className="p-3 text-left">Allotted Faculty</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student._id} className="border-t">
              <td className="p-3">{student.rank}</td>
              <td className="p-3">{student.fullName}</td>
              <td className="p-3">{student.cpi}</td>
              <td className="p-3">{student.gateScore}</td>
              <td className="p-3">
                {student.supervisor ? student.supervisor.fullName : 'Not Allotted'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllotmentPage;
