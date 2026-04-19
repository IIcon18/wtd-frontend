import { api } from './client'
import type { SwimProfileCreate, SwimProfileOut } from './types'

export const getSwimProfile = () => api.get<SwimProfileOut>('/swim-profile/me')

export const createSwimProfile = (data: SwimProfileCreate) =>
  api.post<SwimProfileOut>('/swim-profile/', data)

export const updateSwimProfile = (data: Partial<SwimProfileCreate>) =>
  api.patch<SwimProfileOut>('/swim-profile/me', data)
