// vite.config.ts in your client folder
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend API URL
        changeOrigin: true,             // Ensures the origin of the request matches the target
        secure: false,                 // Set to false if you're using HTTP instead of HTTPS
      },
    },
  },
});
