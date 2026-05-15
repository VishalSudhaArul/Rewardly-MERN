import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Attendance from './pages/Attendance';
import Performance from './pages/Performance';
import FeedbackPage from './pages/FeedbackPage';
import RewardsPage from './pages/RewardsPage';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="splash">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role === 'employee') return <Navigate to="/dashboard" />;
  return children;
};

import CelebrationModal from './components/CelebrationModal';

function AppRoutes() {
  const { user, celebration, setCelebration } = useAuth();
  return (
    <>
      {celebration && (
        <CelebrationModal 
          {...celebration} 
          onClose={() => setCelebration(null)} 
        />
      )}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="performance" element={<Performance />} />
          <Route path="feedback" element={<FeedbackPage />} />
          <Route path="rewards" element={<RewardsPage />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e1e2e', color: '#cdd6f4', border: '1px solid #313244' } }} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
