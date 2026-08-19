import { api } from './client'

// 좋아요 수 / 내가 좋아요 했는지 조회
export const getEditionLikes = (conceptId) =>
    api(`/community/editions/${conceptId}/likes`, {
        auth: true,
    })

// 좋아요 등록
export const addEditionLike = (conceptId) =>
    api(`/community/editions/${conceptId}/likes`, {
        method: 'POST',
        auth: true,
    })

// 좋아요 취소
export const removeEditionLike = (conceptId) =>
    api(`/community/editions/${conceptId}/likes`, {
        method: 'DELETE',
        auth: true,
    })