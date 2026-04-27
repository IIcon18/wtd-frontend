import { api } from './client'
import type { ChatHistoryItem, ChatResponse } from './types'

export const sendMessage = (message: string) =>
  api.post<ChatResponse>('/chat/message', { message })

export const getChatHistory = () => api.get<ChatHistoryItem[]>('/chat/history')
