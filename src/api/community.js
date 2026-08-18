import { api } from './client'

export function getCommunityEditions({ keyword = '', page = 0, size = 100 } = {}) {
  const params = new URLSearchParams({ page, size })
  if (keyword) params.set('keyword', keyword)
  return api(`/community/editions?${params}`)
}

// 옷장 전체를 공개한 사람 목록. 여기에만 shareToken 이 있어 진열장 링크를 만들 수 있다.
// 옷장을 공개하지 않은 회원까지 찾으려면 회원 API 의 searchUsers 와 함께 쓴다
export function getPublicCollections({ nickname = '', page = 0, size = 20 } = {}) {
  const params = new URLSearchParams({ page, size })
  if (nickname) params.set('nickname', nickname)
  return api(`/community/collections?${params}`)
}

// 남의 옷장. 보증서가 발급된 공개 카드만 내려온다
export const getSharedView = (shareToken, { page = 0, size = 100 } = {}) =>
  api(`/community/shared/${shareToken}?${new URLSearchParams({ page, size })}`)

export const getCommunityEdition = (conceptId) => api(`/community/editions/${conceptId}`)

export const getLikeStatus = (conceptId) =>
  api(`/community/editions/${conceptId}/likes`, { auth: true })

export const likeEdition = (conceptId) =>
  api(`/community/editions/${conceptId}/likes`, { method: 'POST', auth: true })

export const unlikeEdition = (conceptId) =>
  api(`/community/editions/${conceptId}/likes`, { method: 'DELETE', auth: true })
