import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
      process: 'process/browser',
    }
  },
  optimizeDeps: {
    include: ['crypto-browserify', 'buffer', 'stream-browserify', 'process'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      plugins: []
    }
  },
  base: '/',
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.version': JSON.stringify('v16.0.0'),
    'process.versions': JSON.stringify({}),
  }
})
