import { api } from './client'

export function getCommunityEditions({ keyword = '', page = 0, size = 100 } = {}) {
  const params = new URLSearchParams({ page, size })
  if (keyword) params.set('keyword', keyword)
  return api(`/community/editions?${params}`)
}

// 옷장 전체를 공개한 사람 목록. 회원 API 의 /search 는 봉투({success,data})도 안 씌우고
// 공개 여부도 안 보므로 커뮤니티 검색에는 이걸 쓴다
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
