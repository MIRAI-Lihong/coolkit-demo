import {defineConfig, type ProxyOptions} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const regionProxyMap = {
  cn: 'https://cn-apia.coolkit.cn',
  as: 'https://as-apia.coolkit.cc',
  us: 'https://us-apia.coolkit.cc',
  eu: 'https://eu-apia.coolkit.cc',
  all: 'https://apia.coolkit.cn'
}

const generateProxyConfig = () => {
  const proxyConfig: Record<string, ProxyOptions> = {}
  Object.entries(regionProxyMap).forEach(([region, target]) => {
    proxyConfig[`/${region}`] = {
      target,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(`^\\/${region}`), '')
    }
  })
  return proxyConfig
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: generateProxyConfig()
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
