import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000', // กำหนดให้คำขอที่เริ่มต้นด้วย /api จะถูกส่งไปที่ backend
    },
  },
})
