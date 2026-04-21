import StatCard from '../../components/StatCard'

export default function Analytics() {
  const stats = [
    { title: 'Всего пользователей', value: '1,247', change: '↑ +12% за месяц', changePositive: true },
    { title: 'Активных сегодня', value: '89', change: '↑ +5 к вчера', changePositive: true },
    { title: 'Выручка за месяц', value: '45,890 ₽', change: '↑ +23% за месяц', changePositive: true },
    { title: 'Средний чек', value: '367 ₽', change: '↓ -3% за месяц', changePositive: false },
  ]

  const tariffStats = [
    { name: 'Разовая', count: 124, color: 'bg-primary' },
    { name: 'Base', count: 456, color: 'bg-success' },
    { name: 'Pro', count: 667, color: 'bg-warning' },
  ]

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Аналитика</h1>
        <p className="text-text-secondary text-sm">Статистика платформы за текущий месяц</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Tariff Distribution */}
      <div className="bg-surface rounded-xl p-6 border border-surface-light">
        <h2 className="text-lg font-semibold text-text mb-6">Распределение по тарифам</h2>
        <div className="space-y-4">
          {tariffStats.map((tariff) => {
            const percentage = Math.round((tariff.count / 1247) * 100)
            return (
              <div key={tariff.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-text-secondary text-sm">{tariff.name}</span>
                  <span className="text-text text-sm font-medium">{tariff.count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-surface-light rounded-full h-3">
                  <div 
                    className={`${tariff.color} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Activity Chart Placeholder */}
      <div className="bg-surface rounded-xl p-6 border border-surface-light">
        <h2 className="text-lg font-semibold text-text mb-6">Активность пользователей</h2>
        <div className="flex items-end justify-between gap-2 h-48">
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, idx) => {
            const heights = [60, 80, 45, 90, 75, 40, 55]
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <div 
                  className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/30"
                  style={{ height: `${heights[idx]}%` }}
                />
                <span className="text-text-secondary text-xs">{day}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}