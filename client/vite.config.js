import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  root: './client', // 👈 or whatever your client folder is
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [react(), flowbiteReact()],
  base: '/',
})
