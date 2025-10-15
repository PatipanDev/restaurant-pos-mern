import { defineConfig, loadEnv, type ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': env.VITE_API_URL || 'http://10.80.23.25:3000',
      },
    },
  });
};