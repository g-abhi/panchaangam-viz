import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/panchaangam-viz/',
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['swisseph-wasm']
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split heavy deps into separate parallel-loaded chunks
          'three': ['three', '@react-three/fiber', '@react-three/drei'],
          'react-vendor': ['react', 'react-dom'],
          'ui': [
            '@radix-ui/react-popover',
            '@radix-ui/react-slider',
            '@radix-ui/react-tooltip',
            'lucide-react',
            'date-fns',
          ],
        }
      }
    }
  }
})
