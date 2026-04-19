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
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          WD
        </div>
        <div>
          <h2 className="text-xl font-bold text-text">WD Тренер</h2>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${sending ? 'bg-warning animate-pulse' : 'bg-success animate-pulse'}`} />
            <span className={`text-sm ${sending ? 'text-warning' : 'text-success'}`}>
              {sending ? 'печатает...' : 'онлайн'}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {quickActions.map(action => (
          <button
            key={action}
            onClick={() => handleSend(action)}
            disabled={sending}
            className="px-4 py-2 bg-surface border border-surface-light rounded-lg text-text-secondary hover:text-text hover:border-primary/30 transition-all text-sm disabled:opacity-50"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 scrollbar-hide">
        {loadingHistory ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">🏊</div>
            <p className="text-text-secondary">Напиши тренеру или выбери быстрое действие выше</p>
          </div>
        ) : (
          messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-2xl ${
                  message.sender === 'user'
                    ? 'bg-primary/20 border-primary/30'
                    : 'bg-surface border-surface-light'
                } border rounded-2xl px-6 py-4`}
              >
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-white">
                      WD
                    </div>
                  </div>
                )}
                <p className="text-text whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))
        )}
        {sending && (
          <div className="flex justify-start">
            <div className="bg-surface border border-surface-light rounded-2xl px-6 py-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm mb-3 px-2">{error}</p>
      )}

      {/* Input */}
      <div className="flex gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Написать тренеру..."
          disabled={sending}
          className="flex-1 bg-surface border border-surface-light rounded-xl px-6 py-4 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={sending || !inputValue.trim()}
          className="px-6 py-4 bg-primary rounded-xl text-white font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ↑
        </button>
      </div>
    </div>
  )
}
