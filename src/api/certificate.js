import { api } from './client'

// 보증서 조회
export const getCertificate = (conceptId) =>
    api(`/edition-concepts/${conceptId}/certificate`, {
        auth: true,
    })

// 최종 확정 / 보증서 발급
export const createCertificate = (conceptId) =>
    api(`/edition-concepts/${conceptId}/certificate`, {
        method: 'POST',
        auth: true,
    })