import { defineConfig } from 'vite';
import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Three.js only loads with the home scene and the KTCodex page; keep it out of the entry chunk.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/](three|three-stdlib|@react-three|react-reconciler|its-fine|suspend-react|zustand|maath|@monogrid|troika-[^/\\]+|camera-controls)[\\/]/.test(id)) return 'vendor-three';
          if (/[\\/](gsap|@gsap|lenis)[\\/]/.test(id)) return 'vendor-motion';
          if (/[\\/](react|react-dom|react-router|scheduler)[\\/]/.test(id)) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
});
