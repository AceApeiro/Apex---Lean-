import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
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
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Sidebar() {
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();

  const navItems = [
    { name: t('nav.dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('nav.content'), path: '/content', icon: BookOpen },
    { name: t('nav.games'), path: '/games', icon: Gamepad2 },
    { name: t('nav.gallery'), path: '/gallery', icon: ImageIcon },
    { name: t('nav.tasks'), path: '/tasks', icon: CheckSquare },
    { name: t('nav.minutes'), path: '/minutes', icon: Clock },
    { name: t('nav.reports'), path: '/reports', icon: BarChart3 },
    { name: t('nav.audit'), path: '/audit', icon: ClipboardCheck },
    { name: t('nav.blog'), path: '/blog', icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen">
      <div className="p-6">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-white tracking-tight"
        >
          Team Apex
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-sm text-slate-400 mt-1"
        >
          QA001
        </motion.p>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 + 0.2 }}
            >
              <Link
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'hover:bg-slate-800 hover:text-white hover:translate-x-1'
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "animate-pulse" : "")} />
                {item.name}
              </Link>
            </motion.div>
          );
        })}
      </nav>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 border-t border-slate-800 space-y-4"
      >
        <button
          onClick={() => setLanguage(language === 'en' ? 'si' : 'en')}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Globe className="w-4 h-4" />
          {language === 'en' ? 'සිංහල' : 'English'}
        </button>
        <div className="text-xs text-slate-500 px-3">
          Project: QA001 - HR & Conference
        </div>
      </motion.div>
    </aside>
  );
}
