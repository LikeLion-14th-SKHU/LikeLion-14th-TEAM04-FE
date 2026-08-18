import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss()],
    // 백엔드 CORS 가 http://localhost:3000 만 허용하고, OAuth redirect_uri 도 오리진에서 만들어진다 —
    // 포트가 흔들리면 소셜 콘솔에 등록한 주소와 어긋나므로 고정한다
    server: { port: 3000, strictPort: true },
    // 배포 환경에 소셜 로그인 client id 가 VITE_ 접두사 없이 등록돼 있다.
    // envPrefix 는 startsWith 매칭이라 이 이름으로 시작하는 다른 변수까지 새어나갈 수 있어 —
    // define 으로 이 세 개 변수명만 정확히 값으로 치환한다
    define: {
      'import.meta.env.KAKAO_CLIENT_ID': JSON.stringify(env.KAKAO_CLIENT_ID),
      'import.meta.env.NAVER_CLIENT_ID': JSON.stringify(env.NAVER_CLIENT_ID),
      'import.meta.env.GOOGLE_CLIENT_ID': JSON.stringify(env.GOOGLE_CLIENT_ID),
    },
  }
})
