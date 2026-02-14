import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'

// https://vite.dev/config/
export default defineConfig({
  root: "client",
  build: {
    outDir: "../dist",
    emptyOutDir: true, // Clean dist before build
    // Production optimizations
    minify: isProduction ? 'esbuild' : false,
    target: 'es2020',
    cssMinify: 'lightningcss',
    rollupOptions: {
      external: ['ollama'], // Exclude ollama from client bundle
      output: {
        manualChunks: {
          // Code splitting para melhor cache
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        }
      }
    },
    // Sourcemaps only in development
    sourcemap: !isProduction,
    // Reduzir tamanho do chunk warning
    chunkSizeWarningLimit: 1000
  },
  plugins: [
    react({
      // Otimizações do React plugin
      babel: {
        compact: true,
      }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  // Otimizar dependências
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['ollama'], // Exclude ollama from pre-bundling
  },
  // Proxy para API durante desenvolvimento
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

