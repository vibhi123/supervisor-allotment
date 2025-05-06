import * as React from 'react';
import { Route, Routes } from 'react-router-dom'
import AuthPage from './pages/common/AuthPage';
import UnauthorizedPage from './pages/common/UnauthorizedPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import CompleteProfile from './pages/student/CompleteProfile';
import MTechPreference from './pages/student/MTechPreference';
import StudentProfile from './pages/student/StudentProfile';
import MTechToVerify from './pages/student/MTechToVerify';
import MCAToVerify from './pages/student/MCAToVerify';
import MCATeams from './pages/admin/MCATeams';
import MCATeam from './pages/admin/MCATeam';
import NavBar from './components/Navbar';
import { AuthProvider } from './redux/AuthContext';
import AllFaculty from './pages/faculty/AllFaculty';
import MCAAllotment from './pages/admin/MCAAllotment';
import AllotmentMCA from './pages/faculty/AllotmentMCA';
import MTechAllotment from './pages/student/MTechAllotment';
import MCAAllStudent from './pages/student/MCAAllStudent';
import MCARanklist from './pages/student/MCARanklist';
import MTechAllStudent from './pages/student/MTechAllStudent';
import MTechRanklist from './pages/student/MTechRanklist';
import AddStudent from './pages/admin/AddStudent';
import AddFaculty from './pages/admin/AddFaculty';
import AddAdmin from './pages/admin/AddAdmin';
import EditFacultyDetails from './pages/faculty/EditFacultyDetails';

function App() {

    return (
      <>
      <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={ <AuthPage /> } />
        <Route path="/student/complete-profile" element={ <CompleteProfile /> }/>
        <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
        <Route path="/admin/verify-mtech" element={ <MTechToVerify /> } />
        <Route path="/admin/verify-mca" element={ <MCAToVerify /> } />
        <Route path="/admin/teams-mca" element={ <MCATeams /> } />
        <Route path="/admin/add-student" element={ <AddStudent /> } />
        <Route path="/admin/add-faculty" element={ <AddFaculty /> } />
        <Route path="/admin/add-admin" element={ <AddAdmin /> } />
        <Route path="/admin/edit-faculty/:facultyId" element={ <EditFacultyDetails /> } />
        <Route path="/admin/team-mca/:teamNumber" element={ <MCATeam /> } />
        <Route path="/student/:registrationNumber" element={ <StudentProfile /> } />
        <Route path="/mtech/fill-faculty-preference" element={ <MTechPreference /> }/>
        <Route path="/unauthorized" element={ <UnauthorizedPage /> } />
        <Route path="/faculty-all" element={ <AllFaculty /> } />
        <Route path="/mca-all" element={ <MCAAllStudent /> } />
        <Route path="/allotment-mca" element={ <AllotmentMCA /> } />
        <Route path="/mca-allotment" element={ <MCAAllotment /> } />
        <Route path="/mca-ranklist" element={ <MCARanklist /> } />
        <Route path="/mtech-allotment" element={ <MTechAllotment /> } />
        <Route path="/mtech-all" element={ <MTechAllStudent/> } />
        <Route path="/mtech-ranklist" element={ <MTechRanklist /> } />
      </Routes>
      </AuthProvider>
      </>
  );
}

export default App;
