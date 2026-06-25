import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/cn': {
        target: 'https://cn-apia.coolkit.cn',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/cn/, '')
      },
      '/as': {
        target: 'https://as-apia.coolkit.cc',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/as/, '')
      },
      '/us': {
        target: 'https://us-apia.coolkit.cc',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/us/, '')
      },
      '/eu': {
        target: 'https://eu-apia.coolkit.cc',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/eu/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
