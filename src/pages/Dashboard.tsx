import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/StatCard'
import WorkoutCard from '../components/WorkoutCard'
import { useAuth } from '../context/AuthContext'
import { getHistory } from '../api/history'
import { getMySubscription } from '../api/subscriptions'
import type { ChatHistoryItem, SubscriptionOut } from '../api/types'

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1).replace('.0', '')} КМ`
  return `${meters}м`
}

function workoutTypeLabel(type: string): 'техника' | 'выносливость' | 'скорость' | 'восстановление' {
  const map: Record<string, 'техника' | 'выносливость' | 'скорость' | 'восстановление'> = {
    technique: 'техника',
    endurance: 'выносливость',
    speed: 'скорость',
    recovery: 'восстановление',
  }
  return map[type] ?? 'выносливость'
}

function calcStreak(items: ChatHistoryItem[]): number {
  if (!items.length) return 0
  const sorted = [...items].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let expected = new Date(today)

  for (const item of sorted) {
    const d = new Date(item.created_at)
    d.setHours(0, 0, 0, 0)
    if (d.getTime() === expected.getTime()) {
      streak++
      expected.setDate(expected.getDate() - 1)
    } else if (d.getTime() < expected.getTime()) {
      break
    }
  }
  return streak
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [history, setHistory] = useState<ChatHistoryItem[]>([])
  const [subscription, setSubscription] = useState<SubscriptionOut | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getHistory().catch(() => [] as ChatHistoryItem[]),
      getMySubscription().catch(() => null),
    ]).then(([hist, sub]) => {
      setHistory(hist)
      setSubscription(sub)
    }).finally(() => setLoading(false))
  }, [])

  const currentDate = new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Stats
  const now = new Date()
  const thisMonthWorkouts = history.filter(h => {
    const d = new Date(h.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })
  const totalDistance = history.reduce((sum, h) => sum + h.distance_m, 0)
  const monthDistance = thisMonthWorkouts.reduce((sum, h) => sum + h.distance_m, 0)
  const streak = calcStreak(history)

  // Subscription badge
  const subBadge = subscription
    ? `${subscription.tier.toUpperCase()} активна — до ${new Date(subscription.expires_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : null

  const recentWorkouts = history.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">
          Привет, {user?.name ?? '...'} 👋
        </h1>
        <p className="text-text-secondary capitalize">{currentDate}</p>
      </div>

      {/* Subscription Badge */}
      {subBadge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-success text-sm font-medium">{subBadge}</span>
        </div>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface rounded-xl p-6 border border-surface-light animate-pulse h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Тренировок за месяц"
            value={String(thisMonthWorkouts.length)}
            change={history.length > 0 ? `Всего ${history.length} тренировок` : 'Ещё нет тренировок'}
            changePositive={thisMonthWorkouts.length > 0}
          />
          <StatCard
            title="Метраж всего"
            value={formatDistance(totalDistance)}
            change={monthDistance > 0 ? `↑ +${formatDistance(monthDistance)} за месяц` : 'За месяц ещё нет'}
            changePositive={monthDistance > 0}
          />
          <StatCard
            title="Серия дней"
            value={String(streak)}
            change={streak > 0 ? '🔥 продолжай!' : 'Начни серию сегодня'}
            changePositive={streak > 0}
          />
        </div>
      )}

      {/* CTA */}
      <button
        onClick={() => navigate('/chat')}
        className="w-full py-4 bg-primary/10 border-2 border-primary/30 rounded-xl text-primary font-semibold hover:bg-primary/20 transition-all duration-300 flex items-center justify-center gap-2"
      >
        Получить тренировку на сегодня
        <span>→</span>
      </button>

      {/* Recent Workouts */}
      <div>
        <h2 className="text-xl font-semibold text-text mb-4">Последние тренировки</h2>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-surface rounded-xl p-4 border border-surface-light animate-pulse h-16" />
            ))}
          </div>
        ) : recentWorkouts.length === 0 ? (
          <p className="text-text-secondary text-sm">Тренировок пока нет. Начни с чата с тренером!</p>
        ) : (
          <div className="space-y-4">
            {recentWorkouts.map((w, idx) => (
              <WorkoutCard
                key={w.id}
                title={w.content.split('\n')[0].replace(/^#+\s*/, '').slice(0, 60) || 'Тренировка'}
                distance={formatDistance(w.distance_m)}
                duration={`${w.duration_min} мин`}
                poolSize="25м бассейн"
                type={workoutTypeLabel(w.workout_type)}
                date={new Date(w.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                isLast={idx === recentWorkouts.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
