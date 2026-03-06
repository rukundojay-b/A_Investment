// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     fs: {
//       strict: false,
//     },
//   },
//   build: {
//     rollupOptions: {
//       input: './index.html',
//     },
//   }
// })








import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      strict: false,
    },
    allowedHosts: ['.ngrok-free.dev'] // allow ngrok domain
  },
  build: {
    rollupOptions: {
      input: './index.html',
    },
  }
})
