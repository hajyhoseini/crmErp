import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: 'localhost',
    proxy: {
      '/api': {
        target: 'https://smartbase.ir',
        changeOrigin: true,
        headers: { Origin: 'https://smartbase.ir', Referer: 'https://smartbase.ir/' },
      },
    },
  },
});
