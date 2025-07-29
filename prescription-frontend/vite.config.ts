import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Fix for AWS SDK
    global: 'globalThis',
  },
  resolve: {
    alias: {
      // Fix for AWS SDK
      './runtimeConfig': './runtimeConfig.browser',
    },
  },
  optimizeDeps: {
    include: ['aws-amplify']
  }
})