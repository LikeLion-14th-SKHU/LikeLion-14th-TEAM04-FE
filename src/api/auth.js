import { api } from './client'

export const signup = (body) => api('/auth/signup', { method: 'POST', body })

export const login = (body) => api('/auth/login', { method: 'POST', body })

// 백엔드 콜백은 JSON 을 돌려준다 — 인가 화면은 프론트로 돌려보내고, 받은 code 를 여기로 넘긴다
export const socialLogin = (provider, params) =>
  api(`/auth/${provider}/callback?${new URLSearchParams(params)}`)

const OAUTH = {
  kakao: ['https://kauth.kakao.com/oauth/authorize', import.meta.env.VITE_KAKAO_CLIENT_ID, '카카오'],
  naver: ['https://nid.naver.com/oauth2.0/authorize', import.meta.env.VITE_NAVER_CLIENT_ID, '네이버'],
  google: [
    'https://accounts.google.com/o/oauth2/v2/auth',
    import.meta.env.VITE_GOOGLE_CLIENT_ID,
    '구글',
  ],
}

export const PROVIDERS = Object.keys(OAUTH)

export function startOAuth(provider, remember) {
  const [authorizeUrl, clientId, label] = OAUTH[provider]
  // 빈 client_id 로 보내면 남의 에러 화면에 떨어진다 — 여기서 끊는다
  if (!clientId) throw new Error(`${label} 로그인 설정이 아직 없습니다.`)

  // 네이버는 필수 파라미터, 나머지는 CSRF 방지용.
  // randomUUID 는 secure context 전용이라 http://192.168.x.x 로 열면 없다
  const state = [...crypto.getRandomValues(new Uint8Array(16))]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')
  sessionStorage.setItem('oauth-state', state)
  // 인가 화면을 다녀오면 폼 상태가 날아간다 — "로그인 유지" 선택을 여기에 실어 보낸다
  sessionStorage.setItem('oauth-remember', String(Boolean(remember)))

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: `${window.location.origin}/auth/${provider}/callback`,
    state,
  })
  if (provider === 'google') params.set('scope', 'openid email profile')

  window.location.assign(`${authorizeUrl}?${params}`)
}
