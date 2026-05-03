import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ApeiroLogo } from './ApeiroLogo';

export function PageWrapper({ children, isDashboard = false }: { children: React.ReactNode, isDashboard?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 100, 
        damping: 15, 
        mass: 1
      }}
      className="space-y-6 relative"
    >
      {!isDashboard && location.pathname !== '/' && (
        <motion.button
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="absolute -top-2 left-0 z-10 flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
      )}
      <div className={!isDashboard && location.pathname !== '/' ? "pt-10" : ""}>
        <ApeiroLogo compact={!isDashboard} />
      </div>
      {children}
    </motion.div>
  );
}
