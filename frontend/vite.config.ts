import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // หรือ '0.0.0.0' ก็ได้
    proxy: {
      // '/api': 'http://localhost:3000',
      '/api':  process.env.VITE_API_URL || 'http://192.168.1.4:3000', 

    },
  },
});

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0', // สำคัญ! ให้เปิดกับทุก IP
//     port: 5173, // หรือพอร์ตที่คุณใช้
//     strictPort: true, // บังคับใช้พอร์ตนี้
//     cors: true,
//     allowedHosts: true,
//   }
// });

