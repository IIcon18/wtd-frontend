import { useEffect, useState } from 'react'
import {
  adminGetAllPayments,
  adminApprovePayment,
  adminDeclinePayment,
  type AdminPayment,
} from '../../api/admin'

const TIER_LABELS: Record<string, string> = {
  base: 'Base',
  pro: 'Pro',
  single: 'Разовая',
}

const STATUS_TABS = [
  { key: 'pending',  label: 'Ожидают' },
  { key: 'approved', label: 'Подтверждённые' },
  { key: 'declined', label: 'Отклонённые' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export default function Payments() {
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending')
  const [processingId, setProcessingId] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    adminGetAllPayments()
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = payments.filter(p => p.status === activeTab)
  const pendingCount = payments.filter(p => p.status === 'pending').length

  const handleApprove = async (id: number) => {
    setProcessingId(id)
    try {
      const updated = await adminApprovePayment(id)
      setPayments(prev => prev.map(p => p.id === id ? updated : p))
    } catch {
      // ignore
    } finally {
      setProcessingId(null)
    }
  }

  const handleDecline = async (id: number) => {
    setProcessingId(id)
    try {
      const updated = await adminDeclinePayment(id)
      setPayments(prev => prev.map(p => p.id === id ? updated : p))
    } catch {
      // ignore
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Оплаты</h1>
        <p className="text-text-secondary text-sm">
          {pendingCount > 0 ? `${pendingCount} ожидают подтверждения` : 'Новых платежей нет'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-surface-light mb-6">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
              activeTab === tab.key
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text'
            }`}
          >
            {tab.label}
            {tab.key === 'pending' && pendingCount > 0 && (
              <span className="bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
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
          {filtered.map(payment => (
            <div key={payment.id} className="bg-surface rounded-xl p-4 sm:p-5 border border-surface-light">
              <div className="flex items-center justify-between gap-4">
                {/* Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-secondary text-xs font-bold flex-shrink-0">
                    #{payment.id}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text font-medium">
                      {TIER_LABELS[payment.tier] ?? payment.tier}
                      <span className="ml-2 text-primary font-semibold">{payment.price} ₽</span>
                    </p>
                    <p className="text-text-secondary text-xs">
                      user #{payment.user_id} · {formatDate(payment.created_at)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {payment.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleApprove(payment.id)}
                        disabled={processingId === payment.id}
                        className="px-3 py-1.5 bg-success/10 border border-success/30 text-success text-xs font-medium rounded-lg hover:bg-success/20 transition-all disabled:opacity-50"
                      >
                        ✓ Подтвердить
                      </button>
                      <button
                        onClick={() => handleDecline(payment.id)}
                        disabled={processingId === payment.id}
                        className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        ✕ Отклонить
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                      payment.status === 'approved'
                        ? 'bg-success/10 text-success'
                        : 'bg-red-500/10 text-red-400'
                    }`}>
                      {payment.status === 'approved' ? 'подтверждено' : 'отклонено'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-text-secondary">
              <p className="text-4xl mb-4">📭</p>
              <p>Нет платежей в этой категории</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
