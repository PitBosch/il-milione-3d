import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base relativo: il build funziona su GitHub Pages, Netlify, Vercel o qualsiasi hosting statico
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000,
  },
})
