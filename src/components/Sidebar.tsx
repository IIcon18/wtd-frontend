import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { name: "Дашборд", path: "/", icon: "📊" },
  { name: "Чат с тренером", path: "/chat", icon: "💬" },
  { name: "История", path: "/history", icon: "📜" },
  { name: "Профиль", path: "/profile", icon: "👤" },
  { name: "Тарифы", path: "/tariffs", icon: "💰" },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <>
      {/* Overlay для затемнения фона */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-surface border-r border-surface-light z-50 
          w-64 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-surface-light">
          <h1 className="text-xl font-bold text-text">WavesToDream</h1>
          <p className="text-xs text-text-secondary mt-1">AI-тренер по плаванию</p>
        </div>

        {/* Кнопка закрытия (только для мобильных) */}
        <button 
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 text-text-secondary hover:text-text transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onClose} // Закрываем меню при клике
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary/10 text-primary border-l-4 border-primary"
                        : "text-text-secondary hover:bg-surface-light hover:text-text"
                    }`
                  }
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-surface-light">
          <div 
            onClick={() => {
              navigate('/profile')
              onClose()
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-light/50 cursor-pointer hover:bg-surface-light/70 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold flex-shrink-0">
              АК
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">Алексей Козлов</p>
              <p className="text-xs text-text-secondary">Pro — до 9 мая</p>
            </div>
          </div>

          <button
          onClick={async () => {
            await logout()
            navigate('/login')
          }}
          className="w-full mt-3 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Выйти
        </button>
        </div>
      </aside>
    </>
  )
}