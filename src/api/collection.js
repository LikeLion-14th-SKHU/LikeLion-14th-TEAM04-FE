import { api } from './client'

// 내 컬렉션 에디션 목록 조회
export const getMyCollection = ({
    page = 0,
    size = 100,
} = {}) =>
    api(
        `/me/collection?${new URLSearchParams({
            page,
            size,
        })}`,
        {
            auth: true,
        },
    )

// 내 컬렉션 에디션 상세 조회
export const getMyCollectionEdition = (conceptId) =>
    api(`/me/collection/${conceptId}`, {
        auth: true,
    })