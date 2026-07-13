import { useEffect, useState } from 'react'
import {
  adminGetUsers,
  adminGrantSubscription,
  adminRevokeSubscription,
  type UserWithSubscription,
} from '../../api/admin'
import type { SubscriptionTier } from '../../api/types'

const TIER_LABELS: Record<string, string> = {
  base: 'Base',
  pro: 'Pro',
}

const TIER_OPTIONS: { value: SubscriptionTier; label: string }[] = [
  { value: 'base', label: 'Base — 3 запроса/день' },
  { value: 'pro', label: 'Pro — безлимит' },
]

const DAYS_OPTIONS = [
  { value: 7, label: '7 дней' },
  { value: 30, label: '30 дней' },
  { value: 90, label: '90 дней' },
  { value: 365, label: '1 год' },
]

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatExpiry(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

// ── Модальное окно управления подпиской ──────────────────────────────────────

interface ManageModalProps {
  item: UserWithSubscription
  onClose: () => void
  onUpdated: () => void
}

function ManageModal({ item, onClose, onUpdated }: ManageModalProps) {
  const { user, subscription } = item
  const [tier, setTier] = useState<SubscriptionTier>('base')
  const [days, setDays] = useState(30)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGrant = async () => {
    setLoading(true)
    setError('')
    try {
      await adminGrantSubscription(user.id, tier, days)
      onUpdated()
      onClose()
    } catch {
      setError('Не удалось выдать подписку')
    } finally {
      setLoading(false)
    }
  }

  const handleRevoke = async () => {
    setLoading(true)
    setError('')
    try {
      await adminRevokeSubscription(user.id)
      onUpdated()
      onClose()
    } catch {
      setError('Не удалось отозвать подписку')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-surface border border-surface-light rounded-2xl p-6 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {getInitials(user.name)}
          </div>
          <div>
            <p className="text-text font-semibold">{user.name}</p>
            <p className="text-text-secondary text-sm">{user.email}</p>
          </div>
        </div>

        {/* Текущая подписка */}
        <div className="bg-surface-light rounded-xl p-4 mb-6">
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">Текущая подписка</p>
          {subscription && subscription.is_active ? (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-primary font-semibold">{TIER_LABELS[subscription.tier]}</span>
                <span className="text-text-secondary text-sm ml-2">до {formatExpiry(subscription.expires_at)}</span>
              </div>
              <button
                onClick={handleRevoke}
                disabled={loading}
                className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg hover:bg-red-400/10 transition-all disabled:opacity-50"
              >
                Отозвать
              </button>
            </div>
          ) : (
            <p className="text-text-muted text-sm">Нет активной подписки</p>
          )}
        </div>

        {/* Выдать подписку */}
        <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">Выдать подписку</p>

        <div className="space-y-3 mb-4">
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Тариф</label>
            <select
              value={tier}
              onChange={e => setTier(e.target.value as SubscriptionTier)}
              className="w-full bg-background border border-surface-light rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-primary/50"
            >
              {TIER_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-text-secondary text-xs mb-1 block">Срок</label>
            <select
              value={days}
              onChange={e => setDays(Number(e.target.value))}
              className="w-full bg-background border border-surface-light rounded-lg px-3 py-2.5 text-text text-sm focus:outline-none focus:border-primary/50"
            >
              {DAYS_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={handleGrant}
            disabled={loading}
            className="flex-1 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Выдать'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-surface-light rounded-xl text-text-secondary hover:text-text text-sm transition-all"
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Основная страница ─────────────────────────────────────────────────────────

export default function Users() {
  const [items, setItems] = useState<UserWithSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<UserWithSubscription | null>(null)

  const load = () => {
    setLoading(true)
    adminGetUsers()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    adminGetUsers()
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = items.filter(({ user }) =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = items.filter(i => i.subscription?.is_active).length

  return (
    <div>
      {selected && (
        <ManageModal
          item={selected}
          onClose={() => setSelected(null)}
          onUpdated={load}
        />
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Пользователи</h1>
        <p className="text-text-secondary text-sm">
          Всего {items.length} · с подпиской {activeCount}
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени или email..."
          className="w-full sm:w-96 bg-surface border border-surface-light rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface rounded-xl p-5 border border-surface-light animate-pulse h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ user, subscription }) => (
            <div
              key={user.id}
              className="bg-surface rounded-xl p-4 sm:p-5 border border-surface-light hover:border-primary/30 transition-all"
            >
              <div className="flex items-center justify-between gap-4">
                {/* User info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text font-medium truncate">{user.name}</p>
                    <p className="text-text-secondary text-xs truncate">{user.email}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-text-secondary text-xs">Подписка</p>
                    <p className={`font-medium ${subscription?.is_active ? 'text-primary' : 'text-text-muted'}`}>
                      {subscription?.is_active
                        ? `${TIER_LABELS[subscription.tier]} до ${formatExpiry(subscription.expires_at)}`
                        : 'Нет'}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-text-secondary text-xs">Регистрация</p>
                    <p className="text-text font-medium">{formatDate(user.created_at)}</p>
                  </div>
                </div>

                {/* Manage button */}
                <button
                  onClick={() => setSelected({ user, subscription })}
                  className="px-3 py-1.5 text-xs font-medium border border-surface-light rounded-lg text-text-secondary hover:text-text hover:border-primary/30 transition-all flex-shrink-0"
                >
                  Управлять
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-4xl mb-4">🔍</p>
              <p>Пользователи не найдены</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
