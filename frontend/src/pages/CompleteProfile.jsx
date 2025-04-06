import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const CompleteProfile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    branch: "",
    cpi: "",
    dateOfBirth: "",
    gateScore: "",
    interest: "",
    gender: "",
    areaOfResearch: []
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
          navigate("/supervisor-preference");
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
    const { name, value } = e.target;
    if (name === "areaOfResearch") {
      setFormData({
        ...formData,
        areaOfResearch: value.split(",").map((item) => item.trim()),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        "http://localhost:8000/api/student/profile",
        formData,
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile updated successfully!");
      navigate("/supervisor-preference");
    } catch (err) {
      toast.error("Profile update failed");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />

          <select name="branch" value={formData.branch} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select Branch</option>
            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
            <option value="Artificial Intelligence and Data Science">Artificial Intelligence and Data Science</option>
            <option value="Information Security">Information Security</option>
          </select>

          <input type="number" name="cpi" placeholder="CPI" value={formData.cpi} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="date" name="dateOfBirth" placeholder="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          <input type="number" name="gateScore" placeholder="GATE Score (0-1000)" value={formData.gateScore} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
          
          <select name="interest" value={formData.interest} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select Interest</option>
            <option value="Research">Research</option>
            <option value="Internship">Internship</option>
          </select>

          <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          {formData.interest === "Research" && (
            <input
              type="text"
              name="areaOfResearch"
              placeholder="Area of Research (comma-separated)"
              value={formData.areaOfResearch.join(", ")}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-2"
            />
          )}

          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 col-span-2">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;