import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSwimProfile } from '../api/swimProfile'
import { getMySubscription } from '../api/subscriptions'
import type { SwimProfileOut, SubscriptionOut } from '../api/types'

const levelLabels: Record<string, string> = {
  beginner: 'Начинающий',
  intermediate: 'Средний',
  advanced: 'Продвинутый',
}

const goalLabels: Record<string, string> = {
  weight_loss: 'Похудение',
  endurance: 'Выносливость',
  technique: 'Техника',
  competition: 'Соревнования',
}

const tierLabels: Record<string, string> = {
  base: 'Base',
  pro: 'Pro',
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [swimProfile, setSwimProfile] = useState<SwimProfileOut | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionOut | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getSwimProfile().catch(() => null),
      getMySubscription().catch(() => null),
    ]).then(([profile, sub]) => {
      setSwimProfile(profile)
      setSubscription(sub)
    }).finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const registeredAt = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text">{user?.name ?? '...'}</h1>
            <p className="text-text-secondary">{user?.email} · зарегистрирован {registeredAt}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-text-secondary hover:text-text border border-surface-light hover:border-primary/30 rounded-lg transition-all"
        >
          Выйти
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Swim Profile */}
        <div className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold text-text-secondary mb-6 uppercase tracking-wider">
            Профиль пловца
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-10 bg-surface-light rounded animate-pulse" />
              ))}
            </div>
          ) : swimProfile ? (
            <div className="space-y-4">
              {[
                { label: 'Уровень', value: levelLabels[swimProfile.level] ?? swimProfile.level },
                { label: 'Цель', value: goalLabels[swimProfile.goal] ?? swimProfile.goal },
                { label: 'Частота', value: `${swimProfile.sessions_per_week} раза/нед` },
                { label: 'Километраж', value: `${swimProfile.session_km}м` },
                { label: 'Бассейн', value: `${swimProfile.pool_meters}м` },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-3 border-b border-surface-light last:border-0">
                  <span className="text-text-secondary">{item.label}</span>
                  <span className="text-text font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-secondary text-sm mb-4">Профиль пловца не настроен</p>
              <button
                onClick={() => navigate('/chat')}
                className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-lg text-primary text-sm hover:bg-primary/20 transition-all"
              >
                Настроить через тренера
              </button>
            </div>
          )}
        </div>

        {/* Subscription */}
        <div className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold text-text-secondary mb-6 uppercase tracking-wider">
            Подписка
          </h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-10 bg-surface-light rounded animate-pulse" />
              ))}
            </div>
          ) : subscription ? (
            <>
              <div className="space-y-4">
                {[
                  { label: 'Тариф', value: tierLabels[subscription.tier] ?? subscription.tier, highlight: true },
                  {
                    label: 'AI-запросы',
                    value: subscription.tier === 'pro' ? 'Безлимит' : `${subscription.ai_requests_today}/3 сегодня`,
                  },
                  {
                    label: 'Активна до',
                    value: new Date(subscription.expires_at).toLocaleDateString('ru-RU', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    }),
                  },
                  {
                    label: 'Статус',
                    value: subscription.is_active ? 'Активна' : 'Истекла',
                    success: subscription.is_active,
                  },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-surface-light last:border-0">
                    <span className="text-text-secondary">{item.label}</span>
                    <span className={`font-medium ${
                      'highlight' in item && item.highlight ? 'text-primary' :
                      'success' in item && item.success ? 'text-success' :
                      !('success' in item) || item.success === undefined ? 'text-text' : 'text-red-400'
                    }`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/tariffs')}
                className="w-full mt-6 py-3 bg-primary/10 border-2 border-primary/30 rounded-lg text-primary font-semibold hover:bg-primary/20 transition-all"
              >
                Продлить подписку
              </button>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-text-secondary text-sm mb-4">Нет активной подписки</p>
              <button
                onClick={() => navigate('/tariffs')}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all"
              >
                Выбрать тариф
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
