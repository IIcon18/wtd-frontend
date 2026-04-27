import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Chat from './pages/Chat.tsx'
import History from './pages/History.tsx'
import Profile from './pages/Profile.tsx'
import Tariffs from './pages/Tariffs.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'
import AdminLayout from './pages/admin/AdminLayout.tsx'
import Payments from './pages/admin/Payments.tsx'
import Users from './pages/admin/Users.tsx'
import Analytics from './pages/admin/Analytics.tsx'

// Компонент для защиты админских роутов
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // 🔹 Выберите ОДИН из вариантов проверки:

  // Вариант А: Проверка по полю role (если есть в UserOut)
  // if (!user || user.role !== 'admin') return <Navigate to="/" replace />

  // Вариант Б: Проверка по email (для разработки)
  const isAdmin = user?.email === 'admin@waves.com' || user?.email?.endsWith('@admin.waves.com')
  if (!user || !isAdmin) return <Navigate to="/" replace />

  return <>{children}</>
}

function AppLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-surface border border-surface-light rounded-lg text-text hover:bg-surface-light/70 transition-all shadow-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tariffs" element={<Tariffs />} />
        </Routes>
      </main>
    </div>
  )
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <Routes>
      {/* Публичные роуты */}
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Админ-панель */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<Payments />} />
        <Route path="payments" element={<Payments />} />
        <Route path="users" element={<Users />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Основной сайт */}
      <Route path="/*" element={<ProtectedRoute><AppLayout /></ProtectedRoute>} />
    </Routes>
  )
}

export default App