import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/types': path.resolve(__dirname, '../../packages/types')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    target: 'es2020',
    rollupOptions: {
      external: ['@swc/wasm']
    }
  },
  define: {
    global: 'globalThis'
  },
  optimizeDeps: {
    exclude: ['@swc/wasm', '@swc/core']
  }
})