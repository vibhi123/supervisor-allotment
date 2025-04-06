import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfessorSelection = () => {
  const [preferences, setPreferences] = useState(Array(33).fill(""));
  const [selectedProfessors, setSelectedProfessors] = useState(new Set());
  const [professors, setProfessors] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, facultyRes] = await Promise.all([
          axios.get("http://localhost:8000/api/student/profile", {
            headers: { Authorization: `${token}` },
          }),
          axios.get("http://localhost:8000/api/faculty/showAll"),
        ]);
  
        setUser(userRes.data);
        setProfessors(facultyRes.data);
        setPreferences(Array(facultyRes.data.length).fill(""));
        setLoading(false);
  
        if (userRes.data.filledPreference) {
          navigate("/leaderboard");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load data");
        setLoading(false);
      }
    };
  
    if (token) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [navigate, token]);
  

  const handleSelect = (index, value) => {
    const newPreferences = [...preferences];
    newPreferences[index] = value;
    setPreferences(newPreferences);

    const newSet = new Set(newPreferences.filter(Boolean));
    setSelectedProfessors(newSet);
  };

  const handleSubmit = async () => {
    if (!window.confirm("Submit Preferences?\nYou won't be able to change later!")) return;

    try {
      await axios.put(
        "http://localhost:8000/api/student/preferences",
        { facultyPreferences: preferences },
        { headers: { Authorization: `${token}` } }
      );
      toast.success("Preferences submitted successfully!");
      navigate("/leaderboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit preferences");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Select Supervisors by Preference
      </h2>
      <div className="space-y-3">
        {preferences.map((pref, index) => (
          <select
            key={index}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={pref}
            onChange={(e) => handleSelect(index, e.target.value)}
            disabled={index > 0 && !preferences[index - 1]}
          >
            <option value="">Select Preference {index + 1}</option>
            {professors
              .filter(
                (prof) => !selectedProfessors.has(prof._id) || prof._id === pref
              )
              .map((prof) => (
                <option key={prof._id} value={prof._id}>
                  {prof.fullName} ({prof.designation})
                </option>
              ))}
          </select>
        ))}
      </div>

      {preferences.every((p) => p) && (
        <button
          className="mt-6 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          onClick={handleSubmit}
        >
          Submit Preferences
        </button>
      )}
    </div>
  );
};

export default ProfessorSelection;
