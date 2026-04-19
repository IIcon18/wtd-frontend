import { api } from './client'
import type { ChatHistoryItem } from './types'

export const getHistory = () => api.get<ChatHistoryItem[]>('/history/')

export const getSession = (id: number) => api.get<ChatHistoryItem>(`/history/${id}`)

export const saveSession = (data: {
  workout_type: string
  duration_min: number
  distance_m: number
  content: string
}) => api.post<ChatHistoryItem>('/history/save', data)
