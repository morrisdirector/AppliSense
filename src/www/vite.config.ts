import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss()],
  build: {
    outDir: '../../build/www',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        setup: resolve(__dirname, 'setup.html')
      },
      output: {
        name: 'applisense',
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: 'applisense[extname]'
      }
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
})
