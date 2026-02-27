import React from 'react';
import { motion } from 'motion/react';
import { ApeiroLogo } from './ApeiroLogo';

export function PageWrapper({ children, isDashboard = false }: { children: React.ReactNode, isDashboard?: boolean }) {
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
      className="space-y-6"
    >
      <ApeiroLogo compact={!isDashboard} />
      {children}
    </motion.div>
  );
}
