import { useNavigate } from 'react-router-dom';
export default function Profile() {
    const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold">
          АК
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text">Алексей Козлов</h1>
          <p className="text-text-secondary">alexey@mail.ru · зарегистрирован 1 марта 2025</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold text-text-secondary mb-6 uppercase tracking-wider">
            Профиль пловца
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Уровень', value: 'Средний' },
              { label: 'Цель', value: 'Выносливость' },
              { label: 'Частота', value: '3 раза/нед' },
              { label: 'Километраж', value: '1,500–2,000м' },
              { label: 'Бассейн', value: '25м' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-3 border-b border-surface-light last:border-0">
                <span className="text-text-secondary">{item.label}</span>
                <span className="text-text font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-surface-light">
          <h2 className="text-lg font-semibold text-text-secondary mb-6 uppercase tracking-wider">
            Подписка
          </h2>
          <div className="space-y-4">
            {[
              { label: 'Тариф', value: 'Pro', highlight: true },
              { label: 'AI-запросы', value: 'Безлимит' },
              { label: 'Активна до', value: '9 мая 2025' },
              { label: 'Статус', value: 'Активна', success: true },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-3 border-b border-surface-light last:border-0">
                <span className="text-text-secondary">{item.label}</span>
                <span className={`font-medium ${
                  item.highlight ? 'text-primary' : item.success ? 'text-success' : 'text-text'
                }`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/Tariffs')} className="w-full mt-6 py-3 bg-primary/10 border-2 border-primary/30 rounded-lg text-primary font-semibold hover:bg-primary/20 transition-all">
            Продлить подписку
          </button>
        </div>
      </div>
    </div>
  )
}