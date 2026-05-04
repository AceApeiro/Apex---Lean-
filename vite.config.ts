import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    plugins: [react(), tailwindcss()],

    // IMPORTANT: GitHub Pages base path
    base: '/Apex---Lean-/',

    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    server: {
      // safer fallback for dev mode
      hmr: process.env.DISABLE_HMR !== 'true',
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: false,
    },

    preview: {
      port: 4173,
    }
  };
});
