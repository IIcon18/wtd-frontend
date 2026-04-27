import { useState } from 'react'
import { activateTestSubscription } from '../api/subscriptions'

export default function Tariffs() {

  const [testLoading, setTestLoading] = useState(false)
  const [testDone, setTestDone] = useState(false)

  const handleActivateTest = async () => {
    setTestLoading(true)
    try {
      await activateTestSubscription()
      setTestDone(true)
    } finally {
      setTestLoading(false)
    }
  }

  const tariffs = [
    {
      name: 'РАЗОВАЯ',
      price: '149',
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
      name: 'BASE',
      price: '299',
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
      name: 'PRO',
      price: '599',
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

  return (
    <div className="space-y-6 lg:space-y-8 pt-12 lg:pt-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Тарифы</h1>
        <p className="text-text-secondary text-sm sm:text-base">Выбери подходящий формат</p>
      </div>

      {/* Тестовая подписка */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-yellow-400 font-semibold text-sm">Режим разработки</p>
          <p className="text-text-secondary text-xs mt-0.5">Активировать бесплатную Pro-подписку на 7 дней</p>
        </div>
        <button
          onClick={handleActivateTest}
          disabled={testLoading || testDone}
          className="shrink-0 px-4 py-2 rounded-lg text-sm font-semibold bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {testDone ? '✓ Активировано' : testLoading ? 'Активация...' : 'Получить Pro'}
        </button>
      </div>

      {/* Тарифы - одна колонка на мобильных */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {tariffs.map((tariff) => (
          <div
            key={tariff.name}
            className={`relative bg-surface rounded-2xl p-4 sm:p-6 lg:p-8 border ${
              tariff.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-surface-light'
            } hover:border-primary/30 transition-all duration-300`}
          >
            {tariff.popular && (
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-full whitespace-nowrap">
                  Популярный
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

            <button className={`w-full py-2.5 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              tariff.popular
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-surface-light text-text-secondary hover:text-text hover:border-primary/30 border border-surface-light'
            }`}>
              {tariff.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}