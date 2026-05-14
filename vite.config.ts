import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 支持通过环境变量覆盖部署基础路径，例如：VITE_PUBLIC_PATH=/my-game/
  base: process.env.VITE_PUBLIC_PATH ?? '/lore-well/',
})
