import { useState, useEffect } from 'react'
import WorkoutCard from '../components/WorkoutCard'
import { getHistory } from '../api/history'
import type { ChatHistoryItem } from '../api/types'

const filters = ['Все', 'Техника', 'Выносливость', 'Скорость', 'Восстановление']

const typeMap: Record<string, 'техника' | 'выносливость' | 'скорость' | 'восстановление'> = {
  technique: 'техника',
  endurance: 'выносливость',
  speed: 'скорость',
  recovery: 'восстановление',
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1).replace('.0', '')} КМ`
  return `${meters}м`
}

function historyItemToCard(item: ChatHistoryItem) {
  const type = typeMap[item.workout_type] ?? 'выносливость'
  const title = item.content.split('\n')[0].replace(/^#+\s*/, '').slice(0, 60) || 'Тренировка'
  const date = new Date(item.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
  return {
    id: item.id,
    title,
    distance: formatDistance(item.distance_m),
    duration: `${item.duration_min} мин`,
    poolSize: '25м бассейн',
    type,
    date,
  }
}

export default function History() {
  const [activeFilter, setActiveFilter] = useState('Все')
  const [items, setItems] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  const cards = items.map(historyItemToCard)

  const filteredCards = activeFilter === 'Все'
    ? cards
    : cards.filter(c => c.type === activeFilter.toLowerCase())

  const totalDistance = items.reduce((sum, h) => sum + h.distance_m, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">История тренировок</h1>
        <p className="text-text-secondary">
          {loading
            ? 'Загружаем...'
            : `Всего ${items.length} тренировок · ${formatDistance(totalDistance)}`}
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter
                ? 'bg-primary text-white'
                : 'bg-surface border border-surface-light text-text-secondary hover:text-text hover:border-primary/30'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface rounded-xl p-4 border border-surface-light animate-pulse h-20" />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <p className="text-text-secondary text-sm py-8 text-center">
          {activeFilter === 'Все' ? 'Тренировок пока нет. Начни с чата!' : 'Нет тренировок этого типа'}
        </p>
      ) : (
        <div className="space-y-4">
          {filteredCards.map((workout, index) => (
            <WorkoutCard
              key={workout.id}
              {...workout}
              isLast={index === filteredCards.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
