import { Routes, Route } from 'react-router-dom';
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
import Hierarchy from './pages/Hierarchy';
import LeanManagement from './pages/LeanManagement';
import { HallOfFame } from './pages/HallOfFame';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function AppContent() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto w-full">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/aos" element={<AOSDashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/content" element={<Content5S />} />
            <Route path="/games" element={<Games />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/minutes" element={<WeeklyMinutes />} />
            <Route path="/reports" element={<AOSBIDashboard />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/hierarchy" element={<Hierarchy />} />
            <Route path="/lean-management" element={<LeanManagement />} />
            <Route path="/hall-of-fame" element={<HallOfFame />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
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
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
