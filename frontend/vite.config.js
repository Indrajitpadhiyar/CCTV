import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cctv-proxy': {
        target: 'https://cctv.corp8.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cctv-proxy/, ''),
        secure: false,
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
