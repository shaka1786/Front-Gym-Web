import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // permite acceso desde la red (0.0.0.0)
    port: 5173, // puerto de tu frontend
    allowedHosts: [
      "visualstudiocode1.smh1786.space", // tu dominio público
    ],
    proxy: {
      '/api': {
        target: 'http://192.168.1.35:3000', // ⚠️ tu backend real (puedes usar localhost si todo corre en el mismo PC)
        changeOrigin: true,
      },
    },
  },
})
