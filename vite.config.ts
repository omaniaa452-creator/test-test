import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // CRITICAL: Ensures assets use relative paths (e.g., "assets/index.js") instead of absolute ("/assets/index.js")
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})