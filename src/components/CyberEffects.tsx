import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.1)'; // Dark blue/slate background fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0ea5e9'; // Cyan/blue text
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 opacity-20 pointer-events-none"
    />
  );
}

export function CreatorLaser() {
  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_20px_5px_rgba(34,211,238,0.5)]"
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 3.5,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-12 border border-cyan-500/30 rounded-full flex items-center justify-between px-4">
           <div className="w-2 h-2 border-t border-l border-cyan-400" />
           <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
           <div className="w-2 h-2 border-b border-r border-cyan-400" />
        </div>
      </motion.div>
    </div>
  );
}
