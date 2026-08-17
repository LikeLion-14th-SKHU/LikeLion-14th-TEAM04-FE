import { api } from './client'

export const getMyPublicSettings = () => api('/me/public-settings', { auth: true })

export const updateCollectionVisibility = (isPublic) =>
  api('/me/public-settings/collection', { method: 'PATCH', body: { isPublic }, auth: true })

export const updateCardVisibility = (conceptId, isPublic) =>
  api(`/me/public-settings/cards/${conceptId}`, {
    method: 'PATCH',
    body: { isPublic },
    auth: true,
  })
