import { useEffect, useState } from 'react'
import { getSwimProfile, createSwimProfile } from '../api/swimProfile'
import type { SwimProfileCreate, SwimLevel, SwimGoal, SessionsPerWeek, SessionKm, PoolSize } from '../api/types'

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

export default function SwimProfileSetupModal() {
  const [visible, setVisible] = useState(false)
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
    getSwimProfile()
      .then(() => { /* профиль есть — не показываем */ })
      .catch(() => { setVisible(true) })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      await createSwimProfile(form)
      setVisible(false)
    } catch {
      setError('Не удалось сохранить. Попробуй ещё раз.')
    } finally {
      setSaving(false)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-surface rounded-2xl border border-surface-light w-full max-w-md p-6 space-y-5 shadow-2xl">
        {/* Header */}
        <div>
          <h3 className="text-xl font-bold text-text">Создать профиль пловца</h3>
          <p className="text-text-secondary text-sm mt-1">
            Заполни один раз — тренер подберёт тренировки под тебя
          </p>
        </div>

        {/* Fields */}
        <Field label="Уровень">
          <Select
            options={LEVELS}
            value={form.level}
            onChange={v => setForm(f => ({ ...f, level: v as SwimLevel }))}
          />
        </Field>
        <Field label="Цель">
          <Select
            options={GOALS}
            value={form.goal}
            onChange={v => setForm(f => ({ ...f, goal: v as SwimGoal }))}
          />
        </Field>
        <Field label="Частота тренировок">
          <Select
            options={SESSIONS}
            value={form.sessions_per_week}
            onChange={v => setForm(f => ({ ...f, sessions_per_week: v as SessionsPerWeek }))}
          />
        </Field>
        <Field label="Километраж за тренировку">
          <Select
            options={KM}
            value={form.session_km}
            onChange={v => setForm(f => ({ ...f, session_km: v as SessionKm }))}
          />
        </Field>
        <Field label="Длина бассейна">
          <Select
            options={POOLS}
            value={form.pool_meters}
            onChange={v => setForm(f => ({ ...f, pool_meters: v as PoolSize }))}
          />
        </Field>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => setVisible(false)}
            className="flex-1 py-2.5 rounded-lg border border-surface-light text-text-secondary hover:text-text transition-colors text-sm font-medium"
          >
            Пропустить
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
