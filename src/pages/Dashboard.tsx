import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMySubscription } from '../api/subscriptions'
import { getHistory } from '../api/history'
import StatCard from '../components/StatCard'
import WorkoutCard from '../components/WorkoutCard'
import type { SubscriptionOut, ChatHistoryItem } from '../api/types'

const WORKOUT_TYPE_MAP: Record<string, 'техника' | 'выносливость' | 'скорость' | 'восстановление'> = {
  technique: 'техника',
  endurance: 'выносливость',
  speed: 'скорость',
  recovery: 'восстановление',
}

const WORKOUT_TITLE_MAP: Record<string, string> = {
  technique: 'Тренировка по технике',
  endurance: 'Тренировка на выносливость',
  speed: 'Скоростная тренировка',
  recovery: 'Восстановительная тренировка',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function computeStreak(sessions: ChatHistoryItem[]): number {
  if (!sessions.length) return 0
  const days = new Set(
    sessions.map(s => new Date(s.created_at).toISOString().slice(0, 10))
  )
  const sorted = Array.from(days).sort((a, b) => b.localeCompare(a))
  let streak = 0
  let cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  for (const day of sorted) {
    const d = new Date(day)
    const diff = Math.round((cursor.getTime() - d.getTime()) / 86400000)
    if (diff > 1) break
    streak++
    cursor = d
  }
  return streak
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [sub, setSub] = useState<SubscriptionOut | null>(null)
  const [history, setHistory] = useState<ChatHistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getMySubscription().catch(() => null),
      getHistory().catch(() => []),
    ]).then(([s, h]) => {
      setSub(s)
      setHistory(h ?? [])
    }).finally(() => setLoading(false))
  }, [])

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const now = new Date()
  const monthSessions = history.filter(s => {
    const d = new Date(s.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const monthCount = monthSessions.length
  const totalDistanceM = history.reduce((sum, s) => sum + s.distance_m, 0)
  const streak = computeStreak(history)
  const recentWorkouts = history.slice(0, 3)

  const firstName = user?.name?.split(' ')[0] ?? ''

  const subActive = sub?.is_active
  const subExpiry = sub?.expires_at
    ? new Date(sub.expires_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="space-y-6 lg:space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">
          {firstName ? `Привет, ${firstName} 👋` : 'Добро пожаловать 👋'}
        </h1>
        <p className="text-text-secondary capitalize text-sm sm:text-base">{currentDate}</p>
      </div>

      {/* Subscription badge */}
      {!loading && subActive && subExpiry && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-success text-xs sm:text-sm font-medium">
            {sub?.tier === 'pro' ? 'Pro' : 'Base'} активна — до {subExpiry}
          </span>
        </div>
      )}
      {!loading && !subActive && (
        <button
          onClick={() => navigate('/tariffs')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-warning/10 border border-warning/30 rounded-full"
        >
          <div className="w-2 h-2 bg-warning rounded-full" />
          <span className="text-warning text-xs sm:text-sm font-medium">Нет активной подписки — выбрать тариф</span>
        </button>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Тренировок за месяц"
          value={loading ? '—' : String(monthCount)}
          change={monthCount > 0 ? `${monthCount} за текущий месяц` : 'Пока нет тренировок'}
          changePositive={monthCount > 0}
        />
        <StatCard
          title="Метраж всего"
          value={loading ? '—' : totalDistanceM >= 1000 ? `${(totalDistanceM / 1000).toFixed(1)} КМ` : `${totalDistanceM} М`}
          change={totalDistanceM > 0 ? 'Суммарно за всё время' : 'Пока нет данных'}
          changePositive={totalDistanceM > 0}
        />
        <StatCard
          title="Серия дней"
          value={loading ? '—' : String(streak)}
          change={streak > 0 ? (streak >= 3 ? '🔥 отличная серия!' : 'Продолжай в том же духе') : 'Начни серию сегодня'}
          changePositive={streak > 0}
        />
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate('/chat')}
        className="w-full py-3 sm:py-4 bg-primary/10 border-2 border-primary/30 rounded-xl text-primary font-semibold hover:bg-primary/20 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        Получить тренировку на сегодня
        <span>→</span>
      </button>

      {/* Recent workouts */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-text mb-4">Последние тренировки</h2>
        {loading ? (
          <p className="text-text-secondary text-sm">Загрузка...</p>
        ) : recentWorkouts.length === 0 ? (
          <div className="bg-surface rounded-xl p-6 border border-surface-light text-center">
            <p className="text-text-secondary text-sm mb-3">Тренировок пока нет</p>
            <button
              onClick={() => navigate('/chat')}
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all"
            >
              Получить первую тренировку
            </button>
          </div>
        ) : (
          <div className="space-y-3 lg:space-y-4">
            {recentWorkouts.map(item => (
              <WorkoutCard
                key={item.id}
                title={WORKOUT_TITLE_MAP[item.workout_type] ?? item.workout_type}
                distance={item.distance_m >= 1000 ? `${(item.distance_m / 1000).toFixed(1)} км` : `${item.distance_m} м`}
                duration={`${item.duration_min} мин`}
                type={WORKOUT_TYPE_MAP[item.workout_type] ?? 'техника'}
                date={formatDate(item.created_at)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
