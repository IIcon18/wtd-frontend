import { api } from './client'
import type { UserOut } from './types'

export const getMe = () => api.get<UserOut>('/users/me')

export const updateMe = (data: { name?: string; email?: string }) =>
  api.patch<UserOut>('/users/me', data)
