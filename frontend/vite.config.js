import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
  server: {
    allowedHosts: [
      'all' ,'b188-2409-4089-be43-1aa3-88b8-978f-f402-a965.ngrok-free.app' // ✅ allow all hosts (easiest solution)
    ]
  }
})
