import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

export function ApeiroLogo({ compact = false }: { compact?: boolean }) {
  const rainContainerRef = useRef<HTMLDivElement>(null);
  const [showingFirst, setShowingFirst] = useState(true);

  useEffect(() => {
    const morphInterval = setInterval(() => {
      setShowingFirst(prev => !prev);
    }, 3000);
    return () => clearInterval(morphInterval);
  }, []);

  useEffect(() => {
    const container = rainContainerRef.current;
    if (!container) return;

    const letters = ['A','P','E','I','R','O', '0', '1', '1', '0'];
    let intervals: NodeJS.Timeout[] = [];
    let timeouts: NodeJS.Timeout[] = [];

    function createDrop() {
      if (!container) return;
      const drop = document.createElement('div');
      drop.className = 'absolute text-[#0099ff] font-mono opacity-80 pointer-events-none';
      drop.style.left = Math.random() * 100 + '%';
      drop.style.animation = `fall ${Math.random() * 2.5 + 2}s linear infinite`;
      drop.style.animationDelay = Math.random() * 1.5 + 's';
      drop.style.fontSize = (Math.random() * 12 + 10) + 'px';
      drop.style.fontWeight = '700';
      // Matrix Blur Rain effect
      drop.style.filter = `blur(${Math.random() * 2.5}px)`;
      
      let i = Math.floor(Math.random() * letters.length);
      drop.textContent = letters[i];

      const morph = setInterval(() => {
        i = (i + 1) % letters.length;
        if (drop.parentNode) drop.textContent = letters[i];
        else clearInterval(morph);
      }, 300);
      intervals.push(morph);

      container.appendChild(drop);

      const timeout = setTimeout(() => {
        clearInterval(morph);
        if (drop.parentNode) drop.parentNode.removeChild(drop);
      }, 5200);
      timeouts.push(timeout);
    }

    for (let i = 0; i < 30; i++) {
      timeouts.push(setTimeout(createDrop, i * 100));
    }
    const mainInterval = setInterval(createDrop, 200);
    intervals.push(mainInterval);

    return () => {
      intervals.forEach(clearInterval);
      timeouts.forEach(clearTimeout);
      if (container) container.innerHTML = '';
    };
  }, []);

  return (
    <div className={`relative w-full ${compact ? 'h-32 mb-4' : 'h-80 mb-8'} bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center overflow-hidden rounded-2xl border border-slate-800 shadow-2xl`} style={{ perspective: 1000 }}>
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-110vh); opacity: 1; }
          100% { transform: translateY(110vh); opacity: 0; }
        }
        @keyframes pulse-ring {
          0% { transform: translate(-50%, -50%) scale(0.85); opacity: 0.9; }
          100% { transform: translate(-50%, -50%) scale(1.45); opacity: 0; }
        }
        @keyframes borderGlisten {
          0%, 100% { box-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff, inset 0 0 15px rgba(255,255,255,0.06); border-color: #ffffff; }
          50% { box-shadow: 0 0 25px #ffffff, 0 0 50px #ffffff, 0 0 75px rgba(255,255,255,0.12), inset 0 0 25px rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.9); }
        }
        @keyframes textGlow {
          from { text-shadow: 0 0 10px #0099ff, 0 0 20px #0099ff; }
          to { text-shadow: 0 0 18px #0099ff, 0 0 36px #0099ff; }
        }
      `}</style>
      
      {/* Matrix Rain Container */}
      <div ref={rainContainerRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* 3D Animated Logo Container */}
      <motion.div 
        className={`relative z-30 flex ${compact ? 'flex-row' : 'flex-col'} items-center gap-4 cursor-pointer`}
        animate={{ y: [0, -8, 0], rotateX: [0, 4, 0], rotateY: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        whileHover={{ scale: 1.1, rotateX: 15, rotateY: -15, z: 50 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Pulse Ring */}
        <div 
          className={`absolute ${compact ? 'top-1/2 left-[40px] w-[96px] h-[96px]' : 'top-[64px] left-1/2 w-[144px] h-[144px]'} rounded-full border-2 border-white pointer-events-none mix-blend-screen`}
          style={{ animation: 'pulse-ring 3s ease-out infinite', zIndex: 4, boxShadow: '0 0 10px #ffffff', transform: 'translate(-50%, -50%)' }}
        />

        {/* Circular Embed Wrapper */}
        <div 
          className={`${compact ? 'w-[80px] h-[80px]' : 'w-[128px] h-[128px]'} relative block rounded-full box-border border-2 border-white backdrop-blur-md`}
          style={{
            clipPath: 'circle(50% at 50% 50%)',
            filter: 'drop-shadow(0 0 20px #0099ff)',
            background: 'radial-gradient(circle at center, rgba(0,153,255,0.15), rgba(0,0,0,0.7))',
            animation: 'borderGlisten 3s ease-in-out infinite',
            transform: 'translateZ(30px)'
          }}
        >
          <div className="w-full h-full p-[10px] box-border relative overflow-visible">
            {/* Logo 1 */}
            <svg 
              className="absolute inset-0 w-full h-full block origin-center pointer-events-none"
              style={{
                opacity: showingFirst ? 1 : 0,
                transform: showingFirst ? 'scale(1)' : 'scale(0.92)',
                transition: 'opacity 1s ease-in-out, transform 0.8s ease'
              }}
              viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradA1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0099ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="46" fill="none" stroke="url(#gradA1)" strokeWidth="3"/>
              <text x="60" y="73" textAnchor="middle" fill="url(#gradA1)" fontFamily="Orbitron, sans-serif" fontSize="34" fontWeight="700">A</text>
              <polygon points="60,26 78,44 42,44" fill="url(#gradA1)" opacity="0.85" />
              <rect x="47" y="78" width="26" height="12" fill="url(#gradA1)" opacity="0.6" rx="2" />
            </svg>

            {/* Logo 2 */}
            <svg 
              className="absolute inset-0 w-full h-full block origin-center pointer-events-none"
              style={{
                opacity: showingFirst ? 0 : 1,
                transform: showingFirst ? 'scale(0.92)' : 'scale(1)',
                transition: 'opacity 1s ease-in-out, transform 0.8s ease'
              }}
              viewBox="0 0 120 120" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="gradB2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#0099ff', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <path d="M60 12 L90 40 L90 84 L60 108 L30 84 L30 40 Z" fill="none" stroke="url(#gradB2)" strokeWidth="3" />
              <circle cx="60" cy="44" r="12" fill="url(#gradB2)" />
              <path d="M46 66 Q60 76 74 66" stroke="url(#gradB2)" strokeWidth="4" fill="none" strokeLinecap="round"/>
              <rect x="52" y="82" width="16" height="8" fill="url(#gradB2)" opacity="0.75" rx="2" />
            </svg>
          </div>
        </div>

        {/* Company Text */}
        <div className={`text-center z-50 ${compact ? 'mt-0 text-left' : 'mt-2'}`} style={{ color: '#0099ff', transform: 'translateZ(40px)' }}>
          <h1 
            className={`${compact ? 'text-2xl tracking-[2px]' : 'text-4xl tracking-[3px]'} font-bold m-0`}
            style={{ fontFamily: 'Orbitron, sans-serif', animation: 'textGlow 2s ease-in-out infinite alternate' }}
          >
            APEIRO
          </h1>
          {!compact && (
            <p className="text-base m-0 mt-1 opacity-95 tracking-[2px]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Endless Opportunity
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
