import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "",
    cpi: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/student/profile", {
          headers: { Authorization: `${token}` },
        });
        setUser(res.data);
        setLoading(false);

        if (res.data.filledDetails) {
          navigate("/leaderboard");
        }
      } catch (err) {
        toast.error("Failed to fetch user data");
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put("http://localhost:8000/api/student/profile", formData, {
        headers: { Authorization: `${token}` },
      });

      toast.success("Profile updated successfully!");
      navigate("/leaderboard");
    } catch (err) {
      toast.error("Profile update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="student-dashboard">
      <h2>Complete Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="cpi"
          placeholder="CPI"
          value={formData.cpi}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default StudentDashboard;
