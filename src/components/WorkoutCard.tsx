interface WorkoutCardProps {
  title: string
  distance: string
  duration: string
  poolSize: string
  type: "техника" | "выносливость" | "скорость" | "восстановление"
  date?: string
  isLast?: boolean
}

const typeColors: Record<string, string> = {
  техника: "bg-primary/20 text-primary border-primary/30",
  выносливость: "bg-success/20 text-success border-success/30",
  скорость: "bg-warning/20 text-warning border-warning/30",
  восстановление: "bg-purple-500/20 text-purple-400 border-purple-500/30",
}

export default function WorkoutCard({ 
  title, 
  distance, 
  duration, 
  poolSize, 
  type, 
  date,
  isLast = false
}: WorkoutCardProps) {
  return (
    <div className={`bg-surface rounded-xl p-5 border border-surface-light hover:border-primary/30 transition-all duration-300 ${!isLast ? 'mb-4' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-2 h-2 rounded-full ${
              type === 'техника' ? 'bg-primary' :
              type === 'выносливость' ? 'bg-success' :
              type === 'скорость' ? 'bg-warning' : 'bg-purple-400'
            }`} />
            <h3 className="text-lg font-semibold text-text">{title}</h3>
          </div>
          <p className="text-text-secondary text-sm">
            {distance} · {duration} · {poolSize}
          </p>
          {date && <p className="text-text-muted text-xs mt-2">{date}</p>}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[type]}`}>
          {type}
        </span>
      </div>
    </div>
  )
}