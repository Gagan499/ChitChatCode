import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    port: parseInt(loadEnv('', path.resolve(__dirname, '..'), '').VITE_FRONTEND_PORT || '5173'),
  },
})
