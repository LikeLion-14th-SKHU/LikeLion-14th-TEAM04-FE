import { api } from './client'

export function getCommunityEditions({ keyword = '', page = 0, size = 100 } = {}) {
  const params = new URLSearchParams({ page, size })
  if (keyword) params.set('keyword', keyword)
  return api(`/community/editions?${params}`)
}

export const getCommunityEdition = (conceptId) => api(`/community/editions/${conceptId}`)

export const getLikeStatus = (conceptId) =>
  api(`/community/editions/${conceptId}/likes`, { auth: true })

export const likeEdition = (conceptId) =>
  api(`/community/editions/${conceptId}/likes`, { method: 'POST', auth: true })

export const unlikeEdition = (conceptId) =>
  api(`/community/editions/${conceptId}/likes`, { method: 'DELETE', auth: true })
