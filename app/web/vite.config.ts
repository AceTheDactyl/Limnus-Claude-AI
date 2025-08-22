import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname),
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
    target: 'es2020'
  },
  optimizeDeps: {
    exclude: ['@swc/wasm', '@swc/core', '@swc/wasm-web', '@vitejs/plugin-react-swc']
  },
  define: {
    global: 'globalThis'
  },
  esbuild: {
    jsx: 'automatic',
    loader: 'tsx'
  }
})