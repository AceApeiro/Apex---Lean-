import { Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Content5S from './pages/Content5S';
import Games from './pages/Games';
import Gallery from './pages/Gallery';
import Tasks from './pages/Tasks';
import WeeklyMinutes from './pages/WeeklyMinutes';
import Reports from './pages/Reports';
import QCAudit from './pages/QCAudit';
import Blog from './pages/Blog';

export default function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<Content5S />} />
            <Route path="/games" element={<Games />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/minutes" element={<WeeklyMinutes />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<QCAudit />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
