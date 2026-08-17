import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  // 백엔드 CORS 가 http://localhost:3000 만 허용하고, OAuth redirect_uri 도 오리진에서 만들어진다 —
  // 포트가 흔들리면 소셜 콘솔에 등록한 주소와 어긋나므로 고정한다
  server: { port: 3000, strictPort: true },
})
