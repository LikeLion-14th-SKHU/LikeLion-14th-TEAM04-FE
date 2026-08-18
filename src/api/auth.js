import { api } from './client'

export const signup = (body) => api('/auth/signup', { method: 'POST', body })

export const login = (body) => api('/auth/login', { method: 'POST', body })
