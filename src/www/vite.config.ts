import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: '../../build',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        name: 'applisense',
        assetFileNames: 'applisense.[ext]',
        entryFileNames: 'applisense.js'
      }
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
})
