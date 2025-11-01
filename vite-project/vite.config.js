import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // escucha en 0.0.0.0
    port: 5173, // opcional, pero así te aseguras
    allowedHosts: [
      "visualstudiocode1.smh1786.space", // para poder publicarlo con dominio
    ],
  },
});