import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ViewAllStudents = () => {
  const [students, setStudents] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/students", {
          headers: { Authorization: `${token}` },
        });
        console.log(res.data);
        setStudents(res.data);
      } catch (err) {
        toast.error("Failed to fetch students");
      }
    };

    fetchStudents();
  }, [token]);

  return (
    <div className="container h-full mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">All Students</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Registration Number</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">CPI</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{student.registrationNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{student.fullName || "NA"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {student.filledDetails ? student.cpi : "NA"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewAllStudents;
