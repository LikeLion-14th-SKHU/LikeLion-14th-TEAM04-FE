// 스펙의 servers 는 http 지만 프론트가 https 면 mixed content 로 막힌다 — https 로 고정
// ?? 가 아니라 || 다 — .env 에 빈 값으로 남겨두면 '' 이 통과해서 요청이 프론트 오리진으로 나간다
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.memory-atelier.store/api/v1'

// 토큰은 키 하나에 JSON 으로 넣는다. 로그인 유지면 localStorage, 아니면 sessionStorage
const KEY = 'memory-atelier-auth'

export function saveTokens(tokens, remember) {
  const [store, other] = remember
    ? [localStorage, sessionStorage]
    : [sessionStorage, localStorage]
  other.removeItem(KEY)
  store.setItem(KEY, JSON.stringify(tokens))
}

export function getTokens() {
  const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY)
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearTokens() {
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

async function request(path, { method, body, token }) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  }).catch(() => {
    // fetch 자체가 실패하면(오프라인·CORS) 브라우저의 영문 메시지가 화면에 뜬다
    throw new Error('서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.')
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.success !== true) {
    const error = new Error(json?.message ?? '요청에 실패했습니다.')
    error.status = res.status
    throw error
  }
  return json.data
}

// 모든 응답은 { success, code, message, data } 봉투다 — 벗겨서 data 만 돌려준다
export async function api(path, { method = 'GET', body, auth } = {}) {
  try {
    return await request(path, { method, body, token: auth && getTokens()?.accessToken })
  } catch (error) {
    if (!auth || error.status !== 401) throw error

    // 순환 import 를 피하려고 재발급은 여기서 직접 부른다. 재시도는 딱 1회 — 무한 루프 금지
    const refreshToken = getTokens()?.refreshToken
    if (!refreshToken) {
      clearTokens()
      throw error
    }
    let accessToken
    try {
      ;({ accessToken } = await request('/auth/reissue', {
        method: 'POST',
        body: { refreshToken },
      }))
    } catch {
      clearTokens()
      throw error
    }
    // 리프레시 토큰은 로테이션되지 않는다 — 저장돼 있던 쪽에 그대로 다시 쓴다
    const store = localStorage.getItem(KEY) ? localStorage : sessionStorage
    store.setItem(KEY, JSON.stringify({ accessToken, refreshToken }))
    return request(path, { method, body, token: accessToken })
  }
}
