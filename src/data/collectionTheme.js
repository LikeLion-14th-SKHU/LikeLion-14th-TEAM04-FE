// 컬렉션 테마는 테마 화면에서 정하고 컬렉션 화면이 읽는다.
// 저장 API가 아직 없어 localStorage에 둔다.
// TODO: 컬렉션 설정 API 연동

export const COLORS = [
    {
        value: 'white',
        label: '화이트',
        hex: '#FAF9F6',

        cabinet: '#F4F1EB',
        section: '#FBFAF7',
        slot: '#F0ECE5',
        drawer: '#EEE9E1',
        side: '#FCFBF8',
        border: '#D8D0C5',
        accent: '#A9947D',
    },
    {
        value: 'ivory',
        label: '아이보리',
        hex: '#F3EBDD',

        cabinet: '#EDE2D2',
        section: '#F6EFE5',
        slot: '#EDE2D3',
        drawer: '#E8D9C6',
        side: '#FAF5ED',
        border: '#D1BEA6',
        accent: '#AA896A',
    },
    {
        value: 'butter',
        label: '버터',
        hex: '#E9D9A7',

        cabinet: '#E8D9B1',
        section: '#F2E7C8',
        slot: '#E9DDBB',
        drawer: '#E3D1A3',
        side: '#F8F1DD',
        border: '#CDBB8E',
        accent: '#A58A4E',
    },
    {
        value: 'olive',
        label: '올리브 크림',
        hex: '#C6C59A',

        cabinet: '#CAC9A5',
        section: '#DEDDC0',
        slot: '#D2D1AD',
        drawer: '#C3C298',
        side: '#F2F0DF',
        border: '#AAA97E',
        accent: '#7F8055',
    },
    {
        value: 'rose',
        label: '더스티 로즈',
        hex: '#D3ADA5',

        cabinet: '#D4B1A9',
        section: '#E6CBC5',
        slot: '#DDBDB6',
        drawer: '#CFA8A0',
        side: '#F5EAE7',
        border: '#B99088',
        accent: '#93675F',
    },
    {
        value: 'mocha',
        label: '라이트 모카',
        hex: '#BDA48F',

        cabinet: '#C0AA97',
        section: '#D5C2B1',
        slot: '#CBB5A2',
        drawer: '#BBA18B',
        side: '#F0E7DF',
        border: '#A88E78',
        accent: '#806650',
    },
]
const KEY = 'collection-theme'

export const DEFAULT_THEME = {
    color: 'ivory',
    title: '나의 컬렉션',
}

export const colorOf = (value) =>
    COLORS.find((item) => item.value === value) ??
    COLORS[0]

export function loadTheme() {
    try {
        const stored = JSON.parse(
            localStorage.getItem(KEY) || '{}',
        )

        return {
            ...DEFAULT_THEME,
            ...stored,

            // 예전에 default 값으로 저장된 사용자는
            // 새 기본값 ivory로 자동 변환
            color:
                stored.color === 'default'
                    ? 'ivory'
                    : stored.color ??
                    DEFAULT_THEME.color,
        }
    } catch {
        return DEFAULT_THEME
    }
}

export function saveTheme(theme) {
    localStorage.setItem(
        KEY,
        JSON.stringify(theme),
    )
}