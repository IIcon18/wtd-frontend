import { useState, useEffect, useRef } from 'react'
import { sendMessage, getChatHistory } from '../api/chat'
import type { ChatHistoryItem } from '../api/types'

interface Message {
  id: number
  sender: 'user' | 'ai'
  content: string
  sessionId?: number
}

function historyToMessages(items: ChatHistoryItem[]): Message[] {
  return items
    .slice()
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(item => ({
      id: item.id,
      sender: 'ai' as const,
      content: item.content,
      sessionId: item.id,
    }))
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [loadingHistory, setLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getChatHistory()
      .then(items => setMessages(historyToMessages(items)))
      .catch(() => {})
      .finally(() => setLoadingHistory(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const msg = (text ?? inputValue).trim()
    if (!msg || sending) return

    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      content: msg,
    }
    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    setSending(true)
    setError('')

    try {
      const response = await sendMessage(msg)
      const aiMsg: Message = {
        id: Date.now() + 1,
        sender: 'ai',
        content: response.reply,
        sessionId: response.session_id ?? undefined,
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки')
    } finally {
      setSending(false)
    }
  }

  const quickActions = ['Тренировка на сегодня', 'Восстановительная', 'Скоростная', 'Задать вопрос']

  return (
  <div className="h-[calc(100vh-4rem)] sm:h-[calc(100vh-8rem)] flex flex-col pt-12 lg:pt-0">
    {/* Header */}
    <div className="flex items-center gap-4 mb-4 sm:mb-6 flex-shrink-0">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
        WD
      </div>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-text">WD Тренер</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-success text-xs sm:text-sm">онлайн</span>
        </div>
      </div>
    </div>

    {/* Quick Actions - горизонтальный скролл */}
    <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 overflow-x-auto pb-2 flex-shrink-0 scrollbar-hide">
      {['Тренировка на сегодня', 'Восстановительная', 'Скоростная', 'Задать вопрос'].map((action) => (
        <button
          key={action}
          className="px-3 sm:px-4 py-2 bg-surface border border-surface-light rounded-lg text-text-secondary hover:text-text hover:border-primary/30 transition-all text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
        >
          {action}
        </button>
      ))}
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 mb-20 sm:mb-6 scrollbar-hide">
      {/* ... ваши сообщения ... */}
    </div>

    {/* Input - фиксированный внизу для мобильных */}
    <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-background border-t border-surface-light lg:static lg:border-t-0 lg:bg-transparent lg:p-0">
      <div className="flex gap-2 sm:gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Написать тренеру..."
          className="flex-1 bg-surface border border-surface-light rounded-xl px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          onClick={() => handleSend()}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-primary rounded-xl text-white font-semibold hover:bg-primary-dark transition-colors text-sm sm:text-base"
        >
          ↑
        </button>
      </div>
    </div>
  </div>
)
}
