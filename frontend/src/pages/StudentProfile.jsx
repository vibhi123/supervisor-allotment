import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StudentProfile = () => {
  const { regNo } = useParams();
  const [student, setStudent] = useState(null);
  const [facultyNames, setFacultyNames] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/student/profile/${regNo}`,
          {
            headers: { Authorization: `${token}` },
          }
        );
        setStudent(data);
      } catch (err) {
        toast.error("Failed to load student details");
        navigate("/admin/dashboard");
      }
    };

    fetchStudent();
  }, [regNo, token, navigate]);

  useEffect(() => {
    const fetchFacultyNamesSequentially = async () => {
      if (!student?.facultyPreferences?.length) return;

      const names = [];
      for (let id of student.facultyPreferences) {
        try {
          const res = await axios.get(`http://localhost:8000/api/faculty/name/${id}`, {
            headers: { Authorization: `${token}` },
          });
          // console.log(res);
          names.push(res.data.fullName);
        } catch (err) {
          names.push("Unknown Faculty");
        }
      }
      setFacultyNames(names);
    };

    fetchFacultyNamesSequentially();
  }, [student, token]);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-6xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Student Profile
        </h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left - Student Info */}
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              {student.photo && (
                <img
                  src={student.photo}
                  alt="Student"
                  className="w-36 h-36 rounded-full object-cover mb-4 shadow"
                />
              )}
              <p className="text-xl font-semibold text-gray-800">{student.fullName}</p>
              <p className="text-gray-600">{student.branch}</p>
              <p className="text-sm text-gray-500">{student.gender}</p>
            </div>
  
            <div className="space-y-2 text-gray-700">
              <p><span className="font-medium">CPI:</span> {student.cpi}</p>
              <p><span className="font-medium">GATE Score:</span> {student.gateScore}</p>
              <p><span className="font-medium">Interest:</span> {student.interest}</p>
              <p>
                <span className="font-medium">Date of Birth:</span>{" "}
                {new Date(student.dateOfBirth).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium">Research Areas:</span>{" "}
                {student.areaOfResearch.join(", ")}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`ml-2 px-2 py-1 text-sm rounded-full ${
                    student.isVerified ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {student.isVerified ? "Verified" : "Not Verified"}
                </span>
              </p>
            </div>
          </div>
  
          {/* Right - Faculty Preferences */}
          <div className="bg-gray-50 rounded-lg p-4 shadow-inner h-full max-h-[420px] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4 text-center text-gray-800">
              Faculty Preferences
            </h3>
            {facultyNames.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                {facultyNames.map((name, index) => (
                  <li key={index} className="border-b pb-1">{name}</li>
                ))}
              </ol>
            ) : (
              <p className="text-center text-gray-500">No preferences found.</p>
            )}
          </div>
        </div>
  
        {/* Buttons */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          <button
            onClick={handleVerify}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            Verify
          </button>
          <button
            onClick={handleReject}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );  
};  

export default StudentProfile;
