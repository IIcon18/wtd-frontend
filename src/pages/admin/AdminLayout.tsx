import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const menuItems = [
  { name: "Оплаты", path: "/admin/payments", icon: "💳" },
  { name: "Пользователи", path: "/admin/users", icon: "👥" },
  { name: "Аналитика", path: "/admin/analytics", icon: "📊" },
]

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-text">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-surface border border-surface-light rounded-lg text-text hover:bg-surface-light/70 transition-all"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-surface border-r border-surface-light z-50 w-64 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        {/* Header */}
        <div className="p-6 border-b border-surface-light">
          <h1 className="text-xl font-bold text-text">WavesToDream</h1>
          <p className="text-xs text-text-secondary mt-1">Административная панель</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
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

        {/* Admin User Card */}
        <div className="p-4 border-t border-surface-light">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-surface-light/50">
            <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white font-bold flex-shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text truncate">Администратор</p>
              <p className="text-xs text-text-secondary">admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}