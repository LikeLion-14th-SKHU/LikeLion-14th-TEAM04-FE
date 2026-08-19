// 스펙의 servers 는 http 지만 프론트가 https 면 mixed content 로 막힌다 — https 로 고정
// ?? 가 아니라 || 다 — .env 에 빈 값으로 남겨두면 '' 이 통과해서 요청이 프론트 오리진으로 나간다
export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://api.memory-atelier.store/api/v1'

// 토큰은 키 하나에 JSON 으로 넣는다. 로그인 유지면 localStorage, 아니면 sessionStorage
const KEY = 'memory-atelier-auth'

// 에디션을 만들다 만 흔적(사진 dataURL·사연·회차 id)은 계정에 묶인 데이터다 —
// 계정이 바뀌거나 세션이 끊기면 다음 사람 화면에 남으면 안 된다
const EDITION_DRAFT_KEYS = [
  'edition-form',
  'edition-request',
  'edition-memory-id',
  'edition-generation-id',
  'edition-concept',
]

export const clearEditionDraft = () => {
  EDITION_DRAFT_KEYS.forEach((key) => sessionStorage.removeItem(key))

  // 완료 화면이 사진 dataURL 째로 디스크에 남기는 사본. 로그아웃 말고는 지우는 데가 없었다
  localStorage.removeItem('my-editions')
}

export function saveTokens(tokens, remember) {
  clearEditionDraft()

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
  clearEditionDraft()
  localStorage.removeItem(KEY)
  sessionStorage.removeItem(KEY)
}

async function request(path, { method, body, token }) {
  // 프로필 이미지 업로드처럼 FormData가 들어오는 요청인지 확인한다.
  const isFormData = body instanceof FormData

  const res = await fetch(`${BASE_URL}${path}`, {
    method,

    headers: {
      // FormData일 때 Content-Type을 직접 넣으면 boundary가 빠지므로
      // 브라우저가 자동으로 설정하도록 둔다.
      ...(body &&
        !isFormData && {
        'Content-Type': 'application/json',
      }),

      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
    },

    // 일반 객체는 JSON으로 보내고 FormData는 그대로 보낸다.
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
  }).catch(() => {
    throw new Error(
      '서버에 연결하지 못했습니다. 잠시 후 다시 시도해주세요.',
    )
  })

  // DELETE /me 같은 204 No Content 응답은 body가 없다.
  if (res.status === 204) {
    return null
  }

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(json?.message ?? '요청에 실패했습니다.')
    error.status = res.status
    throw error
  }

  // 공통 응답 형식이면 data만 반환
  if (json?.success === true) {
    return json.data
  }

  // 일부 API가 데이터를 바로 반환하는 경우
  return json
}

// 모든 응답은 { success, code, message, data } 봉투다 — 벗겨서 data 만 돌려준다
export async function api(
  path,
  { method = 'GET', body, auth } = {},
) {
  try {
    return await request(path, {
      method,
      body,
      token: auth && getTokens()?.accessToken,
    })
  } catch (error) {
    if (!auth || error.status !== 401) {
      throw error
    }

    // 순환 import 를 피하려고 재발급은 여기서 직접 부른다.
    // 재시도는 딱 1회 — 무한 루프 금지
    const refreshToken = getTokens()?.refreshToken

    if (!refreshToken) {
      clearTokens()
      throw error
    }

    let accessToken

    try {
      ; ({ accessToken } = await request('/auth/reissue', {
        method: 'POST',
        body: {
          refreshToken,
        },
      }))
    } catch {
      clearTokens()
      throw error
    }

    // 리프레시 토큰은 로테이션되지 않는다.
    const store = localStorage.getItem(KEY)
      ? localStorage
      : sessionStorage

    store.setItem(
      KEY,
      JSON.stringify({
        accessToken,
        refreshToken,
      }),
    )

    return request(path, {
      method,
      body,
      token: accessToken,
    })
  }
}