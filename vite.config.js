import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxy: {
      '/api': process.env.VITE_API_BASE_URL || 'http://localhost:5000',
      '/flask-api': {
        target: process.env.VITE_FLASK_API_URL || 'http://localhost:6000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/flask-api/, '')
      }
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
