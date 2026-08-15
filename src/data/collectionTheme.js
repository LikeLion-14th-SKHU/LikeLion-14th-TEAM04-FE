// 컬렉션 테마는 테마 화면에서 정하고 컬렉션 화면이 읽는다.
// 저장 API 가 아직 없어 localStorage 에 둔다. TODO: 컬렉션 설정 API 연동
export const COLORS = [
    { value: 'red', label: '레드', hex: '#8c3b33' },
    { value: 'black', label: '블랙', hex: '#17120e' },
    { value: 'yellow', label: '옐로우', hex: '#c29a34' },
    { value: 'blue', label: '블루', hex: '#3c4f6b' },
    { value: 'green', label: '그린', hex: '#4a5a3c' },
    { value: 'purple', label: '퍼플', hex: '#5b4470' },
]

const KEY = 'collection-theme'

// 색을 고르기 전 진열장은 원래 크림색이다 — 팔레트에는 없는 값이라 따로 둔다
const DEFAULT_COLOR = { value: 'default', label: '기본', hex: '#f6f0e6' }

export const DEFAULT_THEME = { color: DEFAULT_COLOR.value, title: '나의 컬렉션' }

export const colorOf = (value) =>
    COLORS.find((item) => item.value === value) ?? DEFAULT_COLOR

export function loadTheme() {
    try {
        // 저장된 값이 없거나 깨졌으면 기본값 — 컬렉션 화면이 빈 제목으로 뜨면 안 된다
        return { ...DEFAULT_THEME, ...JSON.parse(localStorage.getItem(KEY) || '{}') }
    } catch {
        return DEFAULT_THEME
    }
}

export function saveTheme(theme) {
    localStorage.setItem(KEY, JSON.stringify(theme))
}
