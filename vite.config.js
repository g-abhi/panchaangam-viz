import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Plugin to copy swisseph WASM/data files to dist with original names
// The Emscripten runtime resolves these via import.meta.url but Vite
// renames them with content hashes, breaking the runtime's XHR fetcher.
function copySwissEphFiles() {
  return {
    name: 'copy-swisseph-files',
    writeBundle(options) {
      const outDir = options.dir || 'dist'
      const assetsDir = path.join(outDir, 'assets')
      const srcDir = path.resolve(__dirname, 'node_modules/swisseph-wasm/wsam')

      if (!existsSync(assetsDir)) mkdirSync(assetsDir, { recursive: true })

      // Copy with original names so Emscripten's URL resolution works
      const files = ['swisseph.wasm', 'swisseph.data']
      for (const file of files) {
        const src = path.join(srcDir, file)
        const dest = path.join(assetsDir, file)
        if (existsSync(src) && !existsSync(dest)) {
          copyFileSync(src, dest)
          console.log(`  ✓ Copied ${file} to ${assetsDir}`)
        }
      }
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/panchaangam-viz/',
  plugins: [react(), copySwissEphFiles()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['swisseph-wasm']
  }
})
