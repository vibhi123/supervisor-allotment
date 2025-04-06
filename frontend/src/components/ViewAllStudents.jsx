import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ViewAllStudents = () => {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/students", {
          // headers: { Authorization: `${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to load students");
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
              <th className="border border-gray-300 px-3 py-2 w-1/6">Reg. No.</th>
              <th className="border border-gray-300 px-4 py-2 w-1/3">Name</th>
              <th className="border border-gray-300 px-4 py-2 w-1/6">CPI</th>
              <th className="border border-gray-300 px-4 py-2 w-1/6">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student._id}
                className="text-center cursor-pointer hover:bg-gray-100 transition"
                onClick={() => navigate(`/admin/view-student/${student.registrationNumber}`)}
              >
                <td className="border border-gray-300 px-3 py-2">{student.registrationNumber}</td>
                <td className="border border-gray-300 px-4 py-2 font-medium">{student.fullName || "NA"}</td>
                <td className="border border-gray-300 px-4 py-2">{student.filledDetails ? student.cpi : "NA"}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-2 py-1 rounded-lg text-white ${student.isVerified ? "bg-green-500" : "bg-red-500"}`}>
                    {student.isVerified ? "Verified" : "Not Verified"}
                  </span>
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
