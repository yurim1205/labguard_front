import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://3.35.234.241:8080',  
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://3.35.234.241:8080',
        ws: true,
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'http://3.35.234.241:8080',
        changeOrigin: true
      }
    }
  },
})