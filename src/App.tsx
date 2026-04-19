import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar, { sidebarExpanded } from './components/Sidebar.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Chat from './pages/Chat.tsx'
import History from './pages/History.tsx'
import Profile from './pages/Profile.tsx'
import Tariffs from './pages/Tariffs.tsx'
import Login from './pages/Login.tsx'
import Register from './pages/Register.tsx'

function AppLayout() {
  const [marginLeft, setMarginLeft] = useState(80)

  useEffect(() => {
    const interval = setInterval(() => {
      setMarginLeft(sidebarExpanded ? 256 : 80)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex min-h-screen bg-background text-text">
      <Sidebar />
      <main
        className="flex-1 transition-all duration-300 ease-in-out p-8"
        style={{ marginLeft: `${marginLeft}px` }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tariffs" element={<Tariffs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}

export default App
