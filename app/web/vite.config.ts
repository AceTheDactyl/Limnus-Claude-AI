import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import { VitePWA } from 'vite-plugin-pwa'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react()
    // Temporarily disabled PWA plugin
    // VitePWA({ ... })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/types': path.resolve(__dirname, '../../packages/types')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          trpc: ['@trpc/client', '@trpc/react-query']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@trpc/client', '@trpc/react-query']
  },
  define: {
    global: 'globalThis',
    'process.env': {}
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})