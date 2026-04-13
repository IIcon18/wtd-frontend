import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

const menuItems = [
  { name: "Дашборд", path: "/", icon: "📊" },
  { name: "Чат с тренером", path: "/chat", icon: "💬" },
  { name: "История", path: "/history", icon: "📜" },
  { name: "Профиль", path: "/profile", icon: "👤" },
  { name: "Тарифы", path: "/tariffs", icon: "💰" },
]

// Экспортируем состояние для App.tsx
export let sidebarExpanded = false
export const setSidebarExpanded = (value: boolean) => {
  sidebarExpanded = value
}

export default function Sidebar() {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  // Синхронизируем состояние
  setSidebarExpanded(isHovered)

  return (
    <aside 
      className={`bg-surface border-r border-surface-light flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 ease-in-out ${
        isHovered ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className={`border-b border-surface-light transition-all duration-300 overflow-hidden ${
        isHovered ? 'p-6 h-auto opacity-100' : 'p-0 h-0 opacity-0'
      }`}>
        <h1 className="text-xl font-bold text-text whitespace-nowrap">WavesToDream</h1>
        <p className="text-xs text-text-secondary mt-1 whitespace-nowrap">AI-тренер по плаванию</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-4 border-primary"
                      : "text-text-secondary hover:bg-surface-light hover:text-text"
                  } ${!isHovered ? 'justify-center' : ''}`
                }
              >
                <span className="text-2xl flex-shrink-0">{item.icon}</span>
                <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                  isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'
                }`}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Card */}
      <div className={`border-t border-surface-light transition-all duration-300 ${
        isHovered ? 'p-4' : 'p-2'
      }`}>
        <div 
          onClick={() => navigate('/profile')}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-light/50 cursor-pointer hover:bg-surface-light/70 transition-all duration-200 ${
            !isHovered ? 'justify-center' : ''
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
            АК
          </div>
          <div className={`flex-1 min-w-0 transition-all duration-300 ${
            isHovered ? 'opacity-100 max-w-xs' : 'opacity-0 max-w-0 overflow-hidden'
          }`}>
            <p className="text-sm font-medium text-text truncate whitespace-nowrap">Алексей Козлов</p>
            <p className="text-xs text-text-secondary whitespace-nowrap">Pro — до 9 мая</p>
          </div>
        </div>
      </div>
    </aside>
  )
}