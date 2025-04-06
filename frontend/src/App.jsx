import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leaderboard from "./pages/Leaderboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import './style.css'
import Register from "./pages/Register";
import CompleteProfile from "./pages/CompleteProfile";
import ProfessorSelection from "./pages/ProfessorSelection";
import StudentProfile from "./pages/StudentProfile";
import FacultyPreferenceForm from "./pages/FacultyPreferenceForm";
import ViewAllStudents from "./components/ViewAllStudents";
import FacultyForm from "./pages/FacultyForm";
import FacultyList from "./pages/FacultyList";
import EditFaculty from "./pages/EditFaculty";


function App() {
  return (
    
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/dashboard/student" element={<StudentDashboard />} />
      <Route path="/supervisor-preference" element={<ProfessorSelection />} />;
      <Route path="/ranklist" element={<Leaderboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />;
      <Route path="/admin/view-students" element={<ViewAllStudents />} />;
      <Route path="/admin/view-student/:regNo" element={<StudentProfile />} />;
      <Route path="/admin/add-faculty" element={<FacultyForm />} />;
      <Route path="/admin/view-all-faculty" element={<FacultyList />} />;
      <Route path="/admin/edit-faculty/:id" element={<EditFaculty />} />;
    </Routes>
  );
}

export default App;
