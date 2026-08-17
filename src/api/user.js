import { api } from './client'

// 내 정보 조회
export const getMe = () =>
    api('/me', {
        auth: true,
    })

// 닉네임 수정
export const updateMe = (nickname) =>
    api('/me', {
        method: 'PATCH',
        auth: true,
        body: {
            nickname,
        },
    })

// 프로필 이미지 수정
export const updateProfileImage = (file) => {
    const formData = new FormData()
    formData.append('file', file)

    return api('/me/profile-image', {
        method: 'PATCH',
        auth: true,
        body: formData,
    })
}

// 회원 탈퇴
export const deleteMe = () =>
    api('/me', {
        method: 'DELETE',
        auth: true,
    })