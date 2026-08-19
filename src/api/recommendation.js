import { api } from './client'

// 확정된 콘셉트의 추천 상품 조회
export const getRecommendations = (conceptId) =>
    api(`/edition-concepts/${conceptId}/recommendations`, {
        auth: true,
    })