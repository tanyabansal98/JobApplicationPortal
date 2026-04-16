import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import type { Role } from './context/AuthContext';
import './index.css';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Navbar from './components/layout/Navbar';
import JobBoard from './pages/student/JobBoard';
import MyApplications from './pages/student/MyApplications';
import ManageJobs from './pages/employer/ManageJobs';
import ViewCandidates from './pages/employer/ViewCandidates';
import AdminDashboard from './pages/admin/AdminDashboard';

// Placeholder Pages for Features

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: Role[] }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;
  return <>{children}</>;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  switch (user.role) {
    case 'STUDENT': return <Navigate to="/student/dashboard" />;
    case 'EMPLOYER': return <Navigate to="/employer/dashboard" />;
    case 'ADMIN': return <Navigate to="/admin/dashboard" />;
    default: return <Navigate to="/unauthorized" />;
  }
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/student/dashboard" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <JobBoard />
                </ProtectedRoute>
              } />

              <Route path="/jobs" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <JobBoard />
                </ProtectedRoute>
              } />

              <Route path="/student/applications" element={
                <ProtectedRoute allowedRoles={['STUDENT']}>
                  <MyApplications />
                </ProtectedRoute>
              } />

              <Route path="/employer/dashboard" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <ManageJobs />
                </ProtectedRoute>
              } />

              <Route path="/employer/candidates/:jobId" element={
                <ProtectedRoute allowedRoles={['EMPLOYER']}>
                  <ViewCandidates />
                </ProtectedRoute>
              } />

              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/dashboard" element={<DashboardRedirect />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/unauthorized" element={<div className="container py-20 text-center"><h2>Access Denied</h2><p>You don't have permission to view this page.</p></div>} />
              <Route path="*" element={<div className="container py-20 text-center"><h2>404 - Page Not Found</h2></div>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
