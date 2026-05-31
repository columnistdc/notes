import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/notes/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
