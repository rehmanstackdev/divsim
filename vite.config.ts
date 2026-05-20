import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest',
      closeBundle() {
        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );
      },
    },
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index:      'index.html',            // main simulator window
        background: 'src/background/index.ts',
        content:    'src/content/index.ts',
        frameGuard: 'src/frame-guard/index.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'background.js';
          if (chunk.name === 'content')    return 'content.js';
          if (chunk.name === 'frameGuard') return 'frame-guard.js';
          return 'assets/[name].js';
        },
        chunkFileNames:  'assets/[name].js',
        assetFileNames:  'assets/[name][extname]',
      },
    },
  },
  server: { port: 3000 },
});
