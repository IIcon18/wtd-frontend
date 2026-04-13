export default function Tariffs() {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">Тарифы</h1>
        <p className="text-text-secondary">Выбери подходящий формат</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tariffs.map((tariff) => (
          <div
            key={tariff.name}
            className={`relative bg-surface rounded-2xl p-8 border ${
              tariff.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-surface-light'
            } hover:border-primary/30 transition-all duration-300`}
          >
            {tariff.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Популярный
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-text-secondary text-sm font-medium mb-2">{tariff.name}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-5xl font-bold text-text">{tariff.price}</span>
                <span className="text-text-secondary">{tariff.period}</span>
              </div>
              <p className="text-text-secondary text-sm">{tariff.description}</p>
            </div>

            <ul className="space-y-4 mb-8">
              {tariff.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className={`w-5 h-5 flex items-center justify-center rounded-full ${
                    feature.included ? 'text-success' : 'text-text-muted'
                  }`}>
                    {feature.included ? '✓' : '−'}
                  </span>
                  <span className={`text-sm ${feature.included ? 'text-text' : 'text-text-muted'}`}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-3 rounded-lg font-semibold transition-all ${
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