import { useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/add-student",
        { registrationNumber, password },
        { headers: { Authorization: `${token}` } }
      );
      setMessage(res.data.message);
      setRegistrationNumber("");
      setPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Add New Student</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Registration Number"
          value={registrationNumber}
          onChange={(e) => setRegistrationNumber(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Temporary Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default AdminDashboard;