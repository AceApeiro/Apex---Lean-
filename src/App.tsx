import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Home';
import Content5S from './pages/Content5S';
import Games from './pages/Games';
import Gallery from './pages/Gallery';
import WeeklyMinutes from './pages/WeeklyMinutes';
import AOSBIDashboard from './pages/AOSBIDashboard';
import Blog from './pages/Blog';
import AuditLogs from './pages/AuditLogs';
import Team from './pages/Team';
import AOSDashboard from './pages/AOSDashboard';
import Login from './pages/Login';
import Hierarchy from './pages/Hierarchy';
import LeanManagement from './pages/LeanManagement';
import { HallOfFame } from './pages/HallOfFame';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/aos" element={<ProtectedRoute><AOSDashboard /></ProtectedRoute>} />
            <Route path="/team" element={<ProtectedRoute><Team /></ProtectedRoute>} />
            <Route path="/content" element={<ProtectedRoute><Content5S /></ProtectedRoute>} />
            <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
            <Route path="/gallery" element={<ProtectedRoute><Gallery /></ProtectedRoute>} />
            <Route path="/minutes" element={<ProtectedRoute><WeeklyMinutes /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><AOSBIDashboard /></ProtectedRoute>} />
            <Route path="/blog" element={<ProtectedRoute><Blog /></ProtectedRoute>} />
            <Route path="/hierarchy" element={<ProtectedRoute><Hierarchy /></ProtectedRoute>} />
            <Route path="/lean-management" element={<ProtectedRoute><LeanManagement /></ProtectedRoute>} />
            <Route path="/hall-of-fame" element={<ProtectedRoute><HallOfFame /></ProtectedRoute>} />
            <Route path="/audit-logs" element={
              <ProtectedRoute adminOnly>
                <AuditLogs />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
