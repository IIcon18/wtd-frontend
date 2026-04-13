import StatCard from '../components/StatCard'
import WorkoutCard from '../components/WorkoutCard'
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">
          Привет, Алексей 👋
        </h1>
        <p className="text-text-secondary capitalize">{currentDate}</p>
      </div>

      {/* Pro Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full">
        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
        <span className="text-success text-sm font-medium">
          Pro активна — до 9 мая 2025
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Тренировок за месяц"
          value="14"
          change="↑ +3 к прошлому"
          changePositive={true}
        />
        <StatCard
          title="Метраж всего"
          value="24 КМ"
          change="↑ +18 км за месяц"
          changePositive={true}
        />
        <StatCard
          title="Серия дней"
          value="6"
          change="🔥 личный рекорд"
          changePositive={true}
        />
      </div>

      {/* CTA Button */}
      <button onClick={() => navigate('/chat')} className="w-full py-4 bg-primary/10 border-2 border-primary/30 rounded-xl text-primary font-semibold hover:bg-primary/20 transition-all duration-300 flex items-center justify-center gap-2">
        
        Получить тренировку на сегодня
        <span>→</span>
      </button>

      {/* Recent Workouts */}
      <div>
        <h2 className="text-xl font-semibold text-text mb-4">Последние тренировки</h2>
        <div className="space-y-4">
          <WorkoutCard
            title="Техника кроля"
            distance="1 600м"
            duration="45 мин"
            poolSize="25м бассейн"
            type="техника"
          />
          <WorkoutCard
            title="Длинная выносливость"
            distance="2 000м"
            duration="60 мин"
            poolSize="25м бассейн"
            type="выносливость"
          />
          <WorkoutCard
            title="Скоростная интервальная"
            distance="2 500м"
            duration="40 мин"
            poolSize="50м бассейн"
            type="скорость"
          />
        </div>
      </div>
    </div>
  )
}