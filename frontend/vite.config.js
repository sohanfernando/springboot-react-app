import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/admin/products': 'http://localhost:8081',
      '/admin/users': 'http://localhost:8081',
      '/admin/orders': 'http://localhost:8081',
      '/api/orders': 'http://localhost:8081',
    },
  },
})
