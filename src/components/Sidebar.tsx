import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BookOpen,
  Image as ImageIcon,
  CheckSquare,
  Clock,
  BarChart3,
  ClipboardCheck,
  Gamepad2,
  Globe,
  MessageSquare,
  Menu,
  X,
  Activity,
  Users,
  Monitor,
  LogOut,
  LogIn,
  Trophy
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { user, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav.aos'), path: '/aos', icon: Monitor },
    { name: t('nav.team'), path: '/team', icon: Users },
    { name: t('nav.hierarchy'), path: '/hierarchy', icon: Users },
    { name: t('nav.leanManagement'), path: '/lean-management', icon: BookOpen },
    { name: t('nav.content'), path: '/content', icon: BookOpen },
    { name: t('nav.games'), path: '/games', icon: Gamepad2 },
    { name: t('nav.gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav.minutes'), path: '/minutes', icon: Clock },
    { name: t('nav.reports'), path: '/reports', icon: BarChart3 },
    { name: t('nav.blog'), path: '/blog', icon: MessageSquare },
    { name: t('nav.hallOfFame'), path: '/hall-of-fame', icon: Trophy },
  ];

  if (isAdmin) {
    navItems.push({ name: t('nav.logs'), path: '/audit-logs', icon: Activity });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative shrink-0"
          >
            <motion.img 
              src="https://i.imgur.com/EIU6acp.png" 
              alt="AOS Logo" 
              className="relative h-8 w-32 object-fill drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Team Apex</h1>
            <span className="text-xs text-slate-400 block -mt-1">Project</span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col h-[100dvh] transition-transform duration-300 ease-in-out md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:flex flex-col items-center justify-center border-b border-slate-800 mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: "spring" }}
            className="relative shrink-0 mb-4"
          >
            <motion.img 
              src="https://i.imgur.com/EIU6acp.png" 
              alt="AOS Logo" 
              className="relative h-12 w-48 object-fill drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-bold text-white tracking-tight text-center"
          >
            Team Apex
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-slate-400 mt-1 text-center"
          >
            Project
          </motion.p>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 md:py-0">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-4 border-t border-slate-800 space-y-4 shrink-0 bg-slate-900"
        >
          {user && (
            <div className="px-3 py-2 bg-slate-800/50 rounded-lg mb-2 border border-slate-700/50">
              <div className="text-xs font-medium text-slate-300 truncate" title={user.email}>{user.email}</div>
              <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center justify-between">
                <span title="Your Unique ID">UID: {user.id.substring(0, 8)}...</span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(user.id);
                    alert('UID copied to clipboard!');
                  }}
                  className="text-indigo-400 hover:text-indigo-300"
                  title="Copy full UID"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4 shrink-0" />
              Admin Login
            </Link>
          )}
          <button
            onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <Globe className="w-4 h-4 shrink-0" />
            {language === 'en' ? 'සිංහල' : 'English'}
          </button>
          
          <div className="px-3 pt-2 pb-1 border-t border-slate-800/50">
            <div className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wider">Theme</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTheme('indigo')} className={cn("w-6 h-6 rounded-full transition-transform bg-[#6366f1]", theme === 'indigo' ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "hover:scale-110")} title="Indigo" />
              <button onClick={() => setTheme('emerald')} className={cn("w-6 h-6 rounded-full transition-transform bg-[#10b981]", theme === 'emerald' ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "hover:scale-110")} title="Emerald" />
              <button onClick={() => setTheme('rose')} className={cn("w-6 h-6 rounded-full transition-transform bg-[#f43f5e]", theme === 'rose' ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "hover:scale-110")} title="Rose" />
              <button onClick={() => setTheme('amber')} className={cn("w-6 h-6 rounded-full transition-transform bg-[#f59e0b]", theme === 'amber' ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "hover:scale-110")} title="Amber" />
              <button onClick={() => setTheme('violet')} className={cn("w-6 h-6 rounded-full transition-transform bg-[#8b5cf6]", theme === 'violet' ? "scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900" : "hover:scale-110")} title="Violet" />
            </div>
          </div>

          <div className="text-xs text-slate-500 px-3 pb-2 mt-2">
            Project: HR & Conference
          </div>
        </motion.div>
      </aside>
    </>
  );
}
