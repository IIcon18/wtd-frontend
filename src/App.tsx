import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar, { sidebarExpanded } from './components/Sidebar.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Chat from './pages/Chat.tsx'
import History from './pages/History.tsx'
import Profile from './pages/Profile.tsx'
import Tariffs from './pages/Tariffs.tsx'

function App() {
  const [marginLeft, setMarginLeft] = useState(80)

  // Синхронизируем отступ с состоянием sidebar
  useEffect(() => {
    const updateMargin = () => {
      setMarginLeft(sidebarExpanded ? 256 : 80)
    }
    
    // Обновляем часто для плавной анимации
    const interval = setInterval(updateMargin, 50)
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
        </Routes>
      </main>
    </div>
  )
}

export default App