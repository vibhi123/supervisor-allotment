import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />;
    </Routes>
  );
}

export default App;
