import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 👈 1. นำเข้าปลั๊กอิน v4 ตรงนี้

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 👈 2. เพิ่มปลั๊กอิน v4 ตรงนี้
  ],
    
})
