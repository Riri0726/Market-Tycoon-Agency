import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // GitHub Pages base path - change 'market-tycoon-agency' to your actual repo name
  // For custom domain, use '/' instead
  base: process.env.NODE_ENV === 'production' ? '/market-tycoon-agency/' : '/',
  build: {
    // Copy 404.html to dist for GitHub Pages SPA routing
    rollupOptions: {
      input: {
        main: './index.html',
        '404': './404.html'
      }
    }
  },
  server: {
    host: true,
    port: 5173
  }
})
