import base44 from "@base44/vite-plugin"
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    base44({
      legacySDKImports:
        process.env.BASE44_LEGACY_SDK_IMPORTS === "true",
      hmrNotifier: true,
      navigationNotifier: true,
      analyticsTracker: false,
      visualEditAgent: true,
    }),
    react()
  ],

  server: {
    proxy: {
      '/api/ai': {
        target: 'http://localhost:3001',
        changeOrigin: true
      },
      '/api/health': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
})