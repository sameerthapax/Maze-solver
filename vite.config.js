import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Maze-solver/', // 👈 VERY important for GitHub Pages
})
