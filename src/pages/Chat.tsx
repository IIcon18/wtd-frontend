import { useState } from 'react'

interface Message {
  id: number
  sender: 'user' | 'ai'
  content: string
  workout?: {
    title: string
    exercises: Array<{
      name: string
      distance?: string
      rest?: string
    }>
    tips: string
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      content: 'Вчера была выносливость — сегодня сделаем технику. Вот программа на 45 минут:',
      workout: {
        title: 'Техника кроля · 1 600м · 25м бассейн',
        exercises: [
          { name: 'Разминка', distance: '400м кроль' },
          { name: '8×50м кроль', rest: 'отд. 20с' },
          { name: '4×100м комплекс', rest: 'отд. 40с' },
          { name: 'Заминка', distance: '200м спокойно' },
        ],
        tips: 'Совет: следи за входом руки в воду',
      },
    },
  ])
  const [inputValue, setInputValue] = useState('')

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMessage: Message = {
      id: messages.length + 1,
      sender: 'user',
      content: inputValue,
    }
    setMessages([...messages, newMessage])
    setInputValue('')
  }

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
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-success text-sm">онлайн</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {['Тренировка на сегодня', 'Восстановительная', 'Скоростная', 'Задать вопрос'].map((action) => (
          <button
            key={action}
            className="px-4 py-2 bg-surface border border-surface-light rounded-lg text-text-secondary hover:text-text hover:border-primary/30 transition-all text-sm"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-6 scrollbar-hide">
        {messages.map((message) => (
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
              
              <p className="text-text mb-4">{message.content}</p>
              
              {message.workout && (
                <div className="bg-surface-light/50 rounded-xl p-4 border-l-4 border-primary">
                  <h3 className="font-semibold text-text mb-3">{message.workout.title}</h3>
                  <div className="space-y-2">
                    {message.workout.exercises.map((exercise, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-text-secondary">{exercise.name}</span>
                        <span className="text-primary">
                          {exercise.distance || exercise.rest}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-success text-sm mt-4">{message.workout.tips}</p>
                  <button className="mt-4 text-text-secondary text-sm hover:text-text transition-colors">
                    Сохранить тренировку
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Написать тренеру..."
          className="flex-1 bg-surface border border-surface-light rounded-xl px-6 py-4 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
        <button
          onClick={handleSend}
          className="px-6 py-4 bg-primary rounded-xl text-white font-semibold hover:bg-primary-dark transition-colors"
        >
          ↑
        </button>
      </div>
    </div>
  )
}