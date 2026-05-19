import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    fs: {
      strict: true,
      allow: ['.']
    },
    watch: {
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    }
  }
})
