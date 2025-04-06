import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const { regNo } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // console.log(regNo);
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/student/profile/${regNo}`, {
          headers: { Authorization: `${token}` },
        });
        setStudent(data);
      } catch (err) {
        toast.error("Failed to load student details");
        navigate("/admin/dashboard");
      }
    };

    fetchStudent();
  }, [regNo, token, navigate]);

  const handleVerify = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/admin/verify/${regNo}`,
        {},
        { headers: { Authorization: `${token}` } }
      );
      toast.success("Student verified successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Verification failed");
    }
  };

  const handleReject = async () => {
    if (!window.confirm("Are you sure you want to reject this student? This action is irreversible.")) return;

    try {
      await axios.put(`http://localhost:8000/api/admin/reject/${regNo}`, {
        headers: { Authorization: `${token}` },
      });
      toast.success("Student rejected successfully!");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error("Failed to reject student");
    }
  };

  if (!student) {
    return <div className="text-center mt-10">Loading student details...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Student Profile
        </h2>
        <div className="flex flex-col items-center">
          {student.photo && (
            <img
              src={student.photo}
              alt="Student"
              className="w-32 h-32 rounded-full mb-4"
            />
          )}
          <p className="text-lg font-semibold">{student.fullName}</p>
          <p className="text-gray-600">{student.branch}</p>
          <p className="text-gray-600">CPI: {student.cpi}</p>
          <p className="text-gray-600">GATE Score: {student.gateScore}</p>
          <p className="text-gray-600">Interest: {student.interest}</p>
          <p className="text-gray-600">Gender: {student.gender}</p>
          <p className="text-gray-600">Date of Birth: {new Date(student.dateOfBirth).toLocaleDateString()}</p>
          <p className="text-gray-600">Research Areas: {student.areaOfResearch.join(", ")}</p>
          <p className={`mt-4 px-3 py-1 rounded-lg ${student.isVerified ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {student.isVerified ? "Verified" : "Not Verified"}
          </p>

          <div className="mt-6 flex gap-4">
            <button
              onClick={handleVerify}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Verify
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
