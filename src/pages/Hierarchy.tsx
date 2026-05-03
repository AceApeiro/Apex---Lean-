import React from 'react';
import { motion } from 'motion/react';
import { PageWrapper } from '../components/PageWrapper';

export default function Hierarchy() {
  return (
    <PageWrapper>
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-16 py-12 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1, 
            type: "spring",
            bounce: 0.4
          }}
          className="relative"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 tracking-tighter text-center uppercase"
            animate={{ 
              textShadow: [
                "0px 0px 20px rgba(37, 99, 235, 0.4)",
                "0px 0px 40px rgba(37, 99, 235, 0.8)",
                "0px 0px 20px rgba(37, 99, 235, 0.4)"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            LEAN STEERING TEAM
          </motion.h1>
          <motion.div 
            className="absolute -inset-8 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-20 blur-3xl -z-10 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.3 }}
          className="relative group"
          style={{ perspective: 1000 }}
        >
          {/* Glowing animated background */}
          <motion.div 
            className="absolute -inset-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-[2rem] blur-xl opacity-70 group-hover:opacity-100 transition duration-500"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          
          {/* Image container */}
          <motion.div 
            className="relative bg-slate-900/40 backdrop-blur-md rounded-3xl p-4 ring-1 ring-white/20 shadow-2xl"
            whileHover={{ scale: 1.02, rotateY: 2, rotateX: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img 
              src="https://i.imgur.com/6u37Cp4.png" 
              alt="Lean Steering Team Hierarchy" 
              className="max-w-full h-auto rounded-2xl shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
