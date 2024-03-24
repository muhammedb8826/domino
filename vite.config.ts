import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
  },
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, '/src'),
  //     "@assets": path.resolve(__dirname, "/src/assets"),
  //     "auth": path.resolve(__dirname, "/src/auth"),
  //     "@components": path.resolve(__dirname, "/src/components"),
  //     "@pages": path.resolve(__dirname, "/src/pages"),
  //     "@redux": path.resolve(__dirname, "/src/redux"),
  //     "@hooks": path.resolve(__dirname, "/src/hooks"),
  //     "@utils": path.resolve(__dirname, "/src/utils"),
  //   },
  // },
})
