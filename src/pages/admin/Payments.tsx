import { useState } from 'react'

interface Payment {
  id: number
  name: string
  initials: string
  email: string
  tariff: string
  date: string
  amount: number
  status: 'pending' | 'confirmed' | 'rejected'
}

const initialPayments: Payment[] = [
  { id: 1, name: 'Мария Волкова', initials: 'МВ', email: 'maria_v', tariff: 'base', date: '9 апр 14:23', amount: 299, status: 'pending' },
  { id: 2, name: 'Дмитрий Смирнов', initials: 'ДС', email: 'dima_swim', tariff: 'Pro', date: '9 апр 12:10', amount: 599, status: 'pending' },
  { id: 3, name: 'Наталья Козлова', initials: 'НК', email: 'nataly_k', tariff: 'Разовая', date: '9 апр 09:45', amount: 149, status: 'pending' },
  { id: 4, name: 'Алексей Козлов', initials: 'АК', email: 'alexey_k', tariff: 'Pro', date: '8 апр 16:30', amount: 599, status: 'confirmed' },
]

const tabs = [
  { key: 'pending', label: 'Ожидают', count: 3 },
  { key: 'confirmed', label: 'Подтвержденные' },
  { key: 'rejected', label: 'Отклонённые' },
]

export default function Payments() {
  const [activeTab, setActiveTab] = useState('pending')
  const [payments, setPayments] = useState(initialPayments)

  const filteredPayments = payments.filter(p => 
    activeTab === 'pending' ? p.status === 'pending' : p.status === activeTab
  )

  const handleConfirm = (id: number) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'confirmed' } : p))
  }

  const handleReject = (id: number) => {
    setPayments(payments.map(p => p.id === id ? { ...p, status: 'rejected' } : p))
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Входящие оплаты</h1>
        <p className="text-text-secondary text-sm">{payments.filter(p => p.status === 'pending').length} ожидают подтверждения</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-surface-light mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.key
                ? 'text-primary border-primary'
                : 'text-text-secondary border-transparent hover:text-text'
            }`}
          >
            {tab.label} {tab.count && <span className="text-text-muted">({tab.count})</span>}
          </button>
        ))}
      </div>

      {/* Payments List */}
      <div className="space-y-3">
        {filteredPayments.map((payment) => (
          <div key={payment.id} className="bg-surface rounded-xl p-4 sm:p-5 border border-surface-light">
            <div className="flex items-center justify-between gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-secondary text-sm font-bold flex-shrink-0">
                  {payment.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-text font-medium truncate">{payment.name}</p>
                  <p className="text-text-secondary text-xs truncate">
                    @{payment.email} · {payment.tariff} · {payment.date}
                  </p>
                </div>
              </div>

              {/* Amount & Actions */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-text font-semibold">{payment.amount} ₽</span>
                
                {payment.status === 'pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleConfirm(payment.id)}
                      className="px-3 py-1.5 bg-success/10 border border-success/30 text-success text-xs font-medium rounded-lg hover:bg-success/20 transition-all flex items-center gap-1"
                    >
                      ✓ Подтвердить
                    </button>
                    <button
                      onClick={() => handleReject(payment.id)}
                      className="px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1"
                    >
                      ✕ Отклонить
                    </button>
                  </div>
                ) : (
                  <span className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                    payment.status === 'confirmed' 
                      ? 'bg-success/10 text-success' 
                      : 'bg-red-500/10 text-red-400'
                  }`}>
                    {payment.status === 'confirmed' ? 'подтверждено' : 'отклонено'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPayments.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-4xl mb-4">📭</p>
            <p>Нет платежей в этой категории</p>
          </div>
        )}
      </div>
    </div>
  )
}