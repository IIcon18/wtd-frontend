import { useState } from 'react'
import WorkoutCard from '../components/WorkoutCard'

const filters = ['Все', 'Техника', 'Выносливость', 'Скорость', 'Восстановление']

const workouts = [
  { title: 'Техника кроля', distance: '1 600м', duration: '45 мин', poolSize: '25м бассейн', type: 'техника' as const, date: '9 апр' },
  { title: 'Длинная выносливость', distance: '2 000м', duration: '60 мин', poolSize: '25м бассейн', type: 'выносливость' as const, date: '8 апр' },
  { title: 'Скоростная интервальная', distance: '2 500м', duration: '45 мин', poolSize: '50м бассейн', type: 'скорость' as const, date: '7 апр' },
  { title: 'Восстановительная', distance: '1 000м', duration: '30 мин', poolSize: '25м бассейн', type: 'восстановление' as const, date: '6 апр' },
]

export default function History() {
  const [activeFilter, setActiveFilter] = useState('Все')
  const filteredWorkouts = activeFilter === 'Все' 
    ? workouts 
    : workouts.filter(w => w.type === activeFilter.toLowerCase())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-text mb-2">История тренировок</h1>
        <p className="text-text-secondary">Всего 14 тренировок · 24 000м</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === filter
                ? 'bg-primary text-white'
                : 'bg-surface border border-surface-light text-text-secondary hover:text-text hover:border-primary/30'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredWorkouts.map((workout, index) => (
          <WorkoutCard key={index} {...workout} isLast={index === filteredWorkouts.length - 1} />
        ))}
      </div>
    </div>
  )
}