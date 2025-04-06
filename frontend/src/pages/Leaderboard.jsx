import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/admin/update-rank", {
          headers: { Authorization: `${token}` },
        });
        setStudents(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    if (!token) {
      navigate("/login");
    } else {
      fetchLeaderboard();
    }
  }, [navigate, token]);

  if (loading) return <p className="text-center text-gray-700 mt-5">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Rank List</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="py-2 px-4 border">Rank</th>
              <th className="py-2 px-4 border">Full Name</th>
              <th className="py-2 px-4 border">CPI</th>
              <th className="py-2 px-4 border">GATE Score</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student._id} className="text-center hover:bg-gray-100">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{student.fullName}</td>
                <td className="py-2 px-4 border">{student.cpi.toFixed(2)}</td>
                <td className="py-2 px-4 border">{student.gateScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
