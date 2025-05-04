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

function App() {

    return (
      <>
      <AuthProvider>
      <NavBar />
      <Routes>
        <Route path="/" element={ <AuthPage /> } />
        <Route path="/student/complete-profile" element={ <CompleteProfile /> }/>
        <Route path="/mtech/fill-faculty-preference" element={ <MTechPreference /> }/>
        <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
        <Route path="/admin/verify-mtech" element={ <MTechToVerify /> } />
        <Route path="/admin/verify-mca" element={ <MCAToVerify /> } />
        <Route path="/admin/teams-mca" element={ <MCATeams /> } />
        <Route path="/admin/team-mca/:teamNumber" element={ <MCATeam /> } />
        <Route path="/unauthorized" element={ <UnauthorizedPage /> } />
        <Route path="/faculty-all" element={ <AllFaculty /> } />
        <Route path="/allotment-mca" element={ <AllotmentMCA /> } />
        <Route path="/mca-allotment" element={ <MCAAllotment /> } />
        <Route path="/mtech-allotment" element={ <MTechAllotment /> } />
        <Route path="/student/:registrationNumber" element={ <StudentProfile /> } />
      </Routes>
      </AuthProvider>
      </>
  );
}

export default App;
