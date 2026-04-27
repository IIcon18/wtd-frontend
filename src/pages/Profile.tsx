import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getSwimProfile, createSwimProfile, updateSwimProfile } from '../api/swimProfile'
import { getMySubscription } from '../api/subscriptions'
import type { SwimProfileOut, SwimProfileCreate, SubscriptionOut, SwimLevel, SwimGoal, SessionsPerWeek, SessionKm, PoolSize } from '../api/types'

const LEVELS: { value: SwimLevel; label: string }[] = [
  { value: 'beginner', label: 'Начинающий' },
  { value: 'intermediate', label: 'Средний' },
  { value: 'advanced', label: 'Продвинутый' },
]
const GOALS: { value: SwimGoal; label: string }[] = [
  { value: 'weight_loss', label: 'Похудение' },
  { value: 'endurance', label: 'Выносливость' },
  { value: 'technique', label: 'Техника' },
  { value: 'competition', label: 'Соревнования' },
]
const SESSIONS: { value: SessionsPerWeek; label: string }[] = [
  { value: '2', label: '2 раза/нед' },
  { value: '3', label: '3 раза/нед' },
  { value: '5', label: '5 раз/нед' },
]
const KM: { value: SessionKm; label: string }[] = [
  { value: '1000', label: '1 000 м' },
  { value: '1500', label: '1 500 м' },
  { value: '2000', label: '2 000 м' },
  { value: '2500+', label: '2 500+ м' },
]
const POOLS: { value: PoolSize; label: string }[] = [
  { value: '25', label: '25 м' },
  { value: '50', label: '50 м' },
]

const label = <T extends string>(list: { value: T; label: string }[], val: T) =>
  list.find(i => i.value === val)?.label ?? val

export default function Profile() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [profile, setProfile] = useState<SwimProfileOut | null>(null)
  const [sub, setSub] = useState<SubscriptionOut | null>(null)
  const [loadingData, setLoadingData] = useState(true)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<SwimProfileCreate>({
    level: 'beginner',
    goal: 'endurance',
    sessions_per_week: '3',
    session_km: '1500',
    pool_meters: '25',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      getSwimProfile().catch(() => null),
      getMySubscription().catch(() => null),
    ]).then(([p, s]) => {
      setProfile(p)
      setSub(s)
      if (p) {
        setForm({
          level: p.level,
          goal: p.goal,
          sessions_per_week: p.sessions_per_week,
          session_km: p.session_km,
          pool_meters: p.pool_meters,
        })
      }
    }).finally(() => setLoadingData(false))
  }, [])

  const openEdit = () => {
    setError('')
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const saved = profile
        ? await updateSwimProfile(form)
        : await createSwimProfile(form)
      setProfile(saved)
      setEditing(false)
    } catch {
      setError('Не удалось сохранить. Попробуй ещё раз.')
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="space-y-6 lg:space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl sm:text-3xl font-bold flex-shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">{user?.name ?? '—'}</h1>
          <p className="text-text-secondary text-xs sm:text-sm">
            {user?.email}
            {user?.created_at ? ` · зарегистрирован ${formatDate(user.created_at)}` : ''}
          </p>
        </div>
      </div>

      {loadingData ? (
        <p className="text-text-secondary text-sm">Загрузка...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">

          {/* Swimmer Profile */}
          <div className="bg-surface rounded-xl p-4 sm:p-6 border border-surface-light">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-text-secondary uppercase tracking-wider">
                Профиль пловца
              </h2>
              <button
                onClick={openEdit}
                className="text-xs text-primary hover:text-primary-dark font-medium transition-colors"
              >
                {profile ? 'Редактировать' : 'Создать'}
              </button>
            </div>

            {profile ? (
              <div className="space-y-0">
                {[
                  { label: 'Уровень', value: label(LEVELS, profile.level) },
                  { label: 'Цель', value: label(GOALS, profile.goal) },
                  { label: 'Частота', value: label(SESSIONS, profile.sessions_per_week) },
                  { label: 'Километраж', value: label(KM, profile.session_km) },
                  { label: 'Бассейн', value: label(POOLS, profile.pool_meters) },
                ].map(item => (
                  <div key={item.label} className="flex justify-between py-3 border-b border-surface-light last:border-0">
                    <span className="text-text-secondary text-sm">{item.label}</span>
                    <span className="text-text font-medium text-sm sm:text-base">{item.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm mb-4">Профиль пловца ещё не создан</p>
                <button
                  onClick={openEdit}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all"
                >
                  Создать профиль
                </button>
              </div>
            )}
          </div>

          {/* Subscription */}
          <div className="bg-surface rounded-xl p-4 sm:p-6 border border-surface-light">
            <h2 className="text-base sm:text-lg font-semibold text-text-secondary mb-6 uppercase tracking-wider">
              Подписка
            </h2>
            {sub ? (
              <>
                <div className="space-y-0">
                  {[
                    { label: 'Тариф', value: sub.tier === 'pro' ? 'Pro' : 'Base', highlight: true },
                    { label: 'AI-запросы', value: sub.tier === 'pro' ? 'Безлимит' : `${sub.ai_requests_today} / 3 сегодня` },
                    { label: 'Активна до', value: formatDate(sub.expires_at) },
                    { label: 'Статус', value: 'Активна', success: true },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-3 border-b border-surface-light last:border-0">
                      <span className="text-text-secondary text-sm">{item.label}</span>
                      <span className={`font-medium text-sm sm:text-base ${
                        (item as any).highlight ? 'text-primary' : (item as any).success ? 'text-success' : 'text-text'
                      }`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate('/tariffs')}
                  className="w-full mt-6 py-3 bg-primary/10 border-2 border-primary/30 rounded-lg text-primary font-semibold hover:bg-primary/20 transition-all text-sm sm:text-base"
                >
                  Продлить подписку
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-text-secondary text-sm mb-4">Нет активной подписки</p>
                <button
                  onClick={() => navigate('/tariffs')}
                  className="px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all"
                >
                  Выбрать тариф
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl border border-surface-light w-full max-w-md p-6 space-y-5">
            <h3 className="text-lg font-bold text-text">
              {profile ? 'Редактировать профиль пловца' : 'Создать профиль пловца'}
            </h3>

            <Field label="Уровень">
              <Select options={LEVELS} value={form.level} onChange={v => setForm(f => ({ ...f, level: v as SwimLevel }))} />
            </Field>
            <Field label="Цель">
              <Select options={GOALS} value={form.goal} onChange={v => setForm(f => ({ ...f, goal: v as SwimGoal }))} />
            </Field>
            <Field label="Частота тренировок">
              <Select options={SESSIONS} value={form.sessions_per_week} onChange={v => setForm(f => ({ ...f, sessions_per_week: v as SessionsPerWeek }))} />
            </Field>
            <Field label="Километраж за тренировку">
              <Select options={KM} value={form.session_km} onChange={v => setForm(f => ({ ...f, session_km: v as SessionKm }))} />
            </Field>
            <Field label="Длина бассейна">
              <Select options={POOLS} value={form.pool_meters} onChange={v => setForm(f => ({ ...f, pool_meters: v as PoolSize }))} />
            </Field>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 py-2.5 rounded-lg border border-surface-light text-text-secondary hover:text-text transition-colors text-sm font-medium"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 py-2.5 rounded-lg bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-50 transition-all text-sm"
              >
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-text-secondary text-xs font-medium uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

function Select({ options, value, onChange }: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-surface-light border border-surface-light rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-primary transition-colors"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}
