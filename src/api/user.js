import { useSyncExternalStore } from 'react'
import { api } from './client'

// 헤더와 마이페이지가 같은 프로필을 봐야 한다 — /me 응답을 여기 담고 구독시킨다.
// ponytail: 모듈 변수 + useSyncExternalStore. 공유할 게 늘면 Context 로
let me = null
const listeners = new Set()

const setMe = (data) => {
    me = data
    listeners.forEach((notify) => notify())
}

// 로그아웃·탈퇴 뒤에도 헤더에 프로필이 남지 않게
export const clearMe = () => setMe(null)

export const useMe = () =>
    useSyncExternalStore(
        (notify) => {
            listeners.add(notify)
            return () => listeners.delete(notify)
        },
        () => me,
    )

// 내 정보 조회
export const getMe = async () => {
    const data = await api('/me', {
        auth: true,
    })

    setMe(data)
    return data
}

// 닉네임 수정
export const updateMe = async (nickname) => {
    const data = await api('/me', {
        method: 'PATCH',
        auth: true,
        body: {
            nickname,
        },
    })

    setMe(data)
    return data
}

// 프로필 이미지 수정
export const updateProfileImage = async (file) => {
    const formData = new FormData()
    formData.append('file', file)

    const data = await api('/me/profile-image', {
        method: 'PATCH',
        auth: true,
        body: formData,
    })

    setMe(data)
    return data
}

// 닉네임 부분 일치 회원 검색 (탈퇴 회원 제외, 인증 불필요).
// 이 응답만 봉투({success,data})가 없어 users 를 그대로 꺼낸다
export const searchUsers = async (nickname, { page = 0, size = 20 } = {}) => {
    const params = new URLSearchParams({ nickname, page, size })
    const data = await api(`/search?${params}`)

    return data?.users ?? []
}

// 회원 탈퇴
export const deleteMe = () =>
    api('/me', {
        method: 'DELETE',
        auth: true,
    })
