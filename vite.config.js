import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    proxy: {
      '/api': {
        target: 'http://103.58.101.236',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://103.58.101.236',
        changeOrigin: true,
      },
    },
  },
})