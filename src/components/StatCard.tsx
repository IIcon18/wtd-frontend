interface StatCardProps {
  title: string
  value: string
  change?: string
  changePositive?: boolean
  icon?: string
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changePositive = true,
  icon 
}: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl p-4 sm:p-6 border border-surface-light hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <p className="text-text-secondary text-xs sm:text-sm">{title}</p>
        {icon && <span className="text-xl sm:text-2xl">{icon}</span>}
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-text mb-1 sm:mb-2">{value}</p>
      {change && (
        <p className={`text-xs sm:text-sm ${changePositive ? "text-success" : "text-red-500"}`}>
          {change}
        </p>
      )}
    </div>
  )
}