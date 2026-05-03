import { useEffect, useState } from 'react'
import WorkoutCard from '../components/WorkoutCard'
import { getHistory } from '../api/history'
import type { ChatHistoryItem } from '../api/types'

const FILTERS = ['Все', 'Техника', 'Выносливость', 'Скорость', 'Восстановление']

const TYPE_MAP: Record<string, 'техника' | 'выносливость' | 'скорость' | 'восстановление'> = {
  technique: 'техника',
  endurance: 'выносливость',
  speed: 'скорость',
  recovery: 'восстановление',
}

const TITLE_MAP: Record<string, string> = {
  technique: 'Тренировка по технике',
  endurance: 'Тренировка на выносливость',
  speed: 'Скоростная тренировка',
  recovery: 'Восстановительная тренировка',
}

const FILTER_TO_TYPE: Record<string, string> = {
  Техника: 'техника',
  Выносливость: 'выносливость',
  Скорость: 'скорость',
  Восстановление: 'восстановление',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export default function History() {
  const [activeFilter, setActiveFilter] = useState('Все')
  const [sessions, setSessions] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'Все'
    ? sessions
    : sessions.filter(s => TYPE_MAP[s.workout_type] === FILTER_TO_TYPE[activeFilter])

  const totalDistanceM = sessions.reduce((sum, s) => sum + s.distance_m, 0)
  const totalKm = totalDistanceM >= 1000
    ? `${(totalDistanceM / 1000).toFixed(1)} км`
    : `${totalDistanceM} м`

  return (
    <div className="space-y-6 lg:space-y-8 pt-12 lg:pt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">История тренировок</h1>
        {loading ? (
          <p className="text-text-secondary text-sm">Загрузка...</p>
        ) : (
          <p className="text-text-secondary text-sm sm:text-base">
            {sessions.length > 0
              ? `Всего ${sessions.length} ${sessions.length === 1 ? 'тренировка' : sessions.length < 5 ? 'тренировки' : 'тренировок'} · ${totalKm}`
              : 'Тренировок пока нет'}
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {FILTERS.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
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
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-surface rounded-xl border border-surface-light animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface rounded-xl p-8 border border-surface-light text-center">
          <p className="text-text-secondary text-sm">
            {sessions.length === 0 ? 'Тренировок пока нет. Начни с чата с тренером!' : 'Нет тренировок по выбранному фильтру'}
          </p>
        </div>
      ) : (
        <div className="space-y-3 lg:space-y-4">
          {filtered.map((item, index) => (
            <WorkoutCard
              key={item.id}
              title={TITLE_MAP[item.workout_type] ?? item.workout_type}
              distance={item.distance_m >= 1000 ? `${(item.distance_m / 1000).toFixed(1)} км` : `${item.distance_m} м`}
              duration={`${item.duration_min} мин`}
              type={TYPE_MAP[item.workout_type] ?? 'техника'}
              date={formatDate(item.created_at)}
              isLast={index === filtered.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
