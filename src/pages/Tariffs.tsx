import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { confirmPayment, createPayment } from '../api/payments'
import { useSubscription } from '../context/SubscriptionContext'
import type { PaymentTier } from '../api/payments'

const PENDING_PAYMENT_KEY = 'wtd_pending_payment_id'

const TARIFFS = [
  {
    tier: 'single' as PaymentTier,
    name: 'РАЗОВАЯ',
    price: 149,
    period: '₽',
    description: 'Одна тренировка без подписки',
    features: [
      { text: '1 AI-тренировка', included: true },
      { text: 'Структурированный формат', included: true },
      { text: 'История тренировок', included: false },
      { text: 'Статистика и прогресс', included: false },
    ],
    buttonText: 'Попробовать',
    popular: false,
  },
  {
    tier: 'base' as PaymentTier,
    name: 'BASE',
    price: 299,
    period: '₽/мес',
    description: '3 тренировки в день',
    features: [
      { text: '3 AI-запроса в день', included: true },
      { text: 'Структурированный формат', included: true },
      { text: 'История тренировок', included: true },
      { text: 'Статистика и прогресс', included: true },
    ],
    buttonText: 'Выбрать',
    popular: true,
  },
  {
    tier: 'pro' as PaymentTier,
    name: 'PRO',
    price: 599,
    period: '₽/мес',
    description: 'Полный доступ без лимитов',
    features: [
      { text: 'Безлимит AI-запросов', included: true },
      { text: 'Структурированный формат', included: true },
      { text: 'История тренировок', included: true },
      { text: 'Статистика и прогресс', included: true },
      { text: 'Приоритетный ответ', included: true },
    ],
    buttonText: 'Выбрать',
    popular: false,
  },
]

type ConfirmState = 'idle' | 'checking' | 'activated' | 'failed'

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default function Tariffs() {
  const [searchParams] = useSearchParams()
  const paymentResult = searchParams.get('payment')

  const { sub, subLoading, refreshSubscription } = useSubscription()
  const [loadingTier, setLoadingTier] = useState<PaymentTier | null>(null)
  const [confirmState, setConfirmState] = useState<ConfirmState>('idle')
  const [buyError, setBuyError] = useState('')

  // After returning from YooKassa — poll confirm endpoint
  useEffect(() => {
    if (paymentResult !== 'success') return

    const pendingId = localStorage.getItem(PENDING_PAYMENT_KEY)
    if (!pendingId) return

    let cancelled = false

    const run = async () => {
      setConfirmState('checking')

      for (let i = 0; i < 10; i++) {
        if (cancelled) return
        try {
          const res = await confirmPayment(Number(pendingId))
          if (res.status === 'activated' || res.status === 'already_active') {
            if (cancelled) return
            localStorage.removeItem(PENDING_PAYMENT_KEY)
            setConfirmState('activated')
            // Обновляем подписку глобально — сайдбар тоже обновится
            await refreshSubscription()
            return
          }
        } catch {
          // Network error or 404 — keep retrying
        }
        await sleep(2000)
      }

      if (!cancelled) setConfirmState('failed')
    }

    run()
    return () => { cancelled = true }
  }, [paymentResult])

  const handleBuy = async (tier: PaymentTier) => {
    setBuyError('')
    setLoadingTier(tier)
    try {
      const res = await createPayment(tier)
      localStorage.setItem(PENDING_PAYMENT_KEY, String(res.payment_id))
      window.location.href = res.confirmation_url
    } catch (e: unknown) {
      setBuyError(e instanceof Error ? e.message : 'Ошибка при создании платежа')
      setLoadingTier(null)
    }
  }

  const activeTierLabel = sub?.is_active
    ? `${sub.tier === 'pro' ? 'Pro' : 'Base'} активна до ${new Date(sub.expires_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}`
    : null

  return (
    <div className="space-y-6 lg:space-y-8 pt-12 lg:pt-0">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Тарифы</h1>
        <p className="text-text-secondary text-sm sm:text-base">Выбери подходящий формат</p>
      </div>

      {/* Payment confirmation banners */}
      {confirmState === 'checking' && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
          <div>
            <p className="text-primary font-semibold text-sm">Подтверждаем оплату...</p>
            <p className="text-text-secondary text-xs mt-0.5">Проверяем статус — займёт несколько секунд</p>
          </div>
        </div>
      )}
      {confirmState === 'activated' && (
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-success text-xl flex-shrink-0">✓</span>
          <div>
            <p className="text-success font-semibold text-sm">Подписка активирована!</p>
            <p className="text-text-secondary text-xs mt-0.5">Доступ к AI-тренеру открыт</p>
          </div>
        </div>
      )}
      {confirmState === 'failed' && (
        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-center gap-3">
          <span className="text-warning text-xl flex-shrink-0">⚠</span>
          <div>
            <p className="text-warning font-semibold text-sm">Не удалось подтвердить автоматически</p>
            <p className="text-text-secondary text-xs mt-0.5">
              Подписка будет активирована в течение нескольких минут. Обнови страницу.
            </p>
          </div>
        </div>
      )}

      {/* Active subscription */}
      {!subLoading && activeTierLabel && (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <p className="text-primary text-sm font-medium">{activeTierLabel}</p>
        </div>
      )}

      {/* Buy error */}
      {buyError && (
        <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4">
          <p className="text-red-400 text-sm">{buyError}</p>
        </div>
      )}

      {/* Tariff cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {TARIFFS.map((tariff) => {
          const isCurrentTier = !subLoading && sub?.is_active === true && sub.tier === tariff.tier
          const isLoading = loadingTier === tariff.tier

          return (
            <div
              key={tariff.tier}
              className={`relative bg-surface rounded-2xl p-4 sm:p-6 lg:p-8 border transition-all duration-300 ${
                tariff.popular
                  ? 'border-primary shadow-lg shadow-primary/10'
                  : 'border-surface-light'
              } hover:border-primary/30`}
            >
              {tariff.popular && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-full whitespace-nowrap">
                    Популярный
                  </span>
                </div>
              )}
              {isCurrentTier && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-success text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Активна
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-text-secondary text-sm font-medium mb-2">{tariff.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text">{tariff.price}</span>
                  <span className="text-text-secondary text-sm">{tariff.period}</span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm">{tariff.description}</p>
              </div>

              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {tariff.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full text-xs sm:text-sm ${
                      feature.included ? 'text-success' : 'text-text-muted'
                    }`}>
                      {feature.included ? '✓' : '−'}
                    </span>
                    <span className={`text-xs sm:text-sm ${feature.included ? 'text-text' : 'text-text-muted'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(tariff.tier)}
                disabled={isLoading || loadingTier !== null || isCurrentTier || confirmState === 'checking'}
                className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
                  tariff.popular
                    ? 'bg-primary text-white hover:bg-primary-dark'
                    : 'bg-surface-light text-text-secondary hover:text-text border border-surface-light hover:border-primary/30'
                }`}
              >
                {isLoading ? 'Переход к оплате...' : isCurrentTier ? 'Активна' : tariff.buttonText}
              </button>
            </div>
          )
        })}
      </div>

      <p className="text-text-muted text-xs text-center">
        Оплата через ЮКасса — банковские карты, СБП, ЮMoney и другие методы.
        После оплаты подписка активируется автоматически.
      </p>
    </div>
  )
}
