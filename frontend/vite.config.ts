import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // หรือ '0.0.0.0' ก็ได้
    proxy: {
      // '/api': 'http://localhost:3000',
      '/api':  process.env.VITE_API_URL || 'http://192.168.1.4:3000', 

    },
  },
});