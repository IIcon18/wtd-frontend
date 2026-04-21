import { useState } from 'react'

interface User {
  id: number
  name: string
  initials: string
  email: string
  tariff: string
  status: 'active' | 'inactive'
  registered: string
  lastActivity: string
}

const users: User[] = [
  { id: 1, name: 'Алексей Козлов', initials: 'АК', email: 'alexey@mail.ru', tariff: 'Pro', status: 'active', registered: '1 мар 2025', lastActivity: 'Сегодня' },
  { id: 2, name: 'Мария Волкова', initials: 'МВ', email: 'maria_v@mail.ru', tariff: 'Base', status: 'active', registered: '15 фев 2025', lastActivity: 'Вчера' },
  { id: 3, name: 'Дмитрий Смирнов', initials: 'ДС', email: 'dima_swim@mail.ru', tariff: 'Pro', status: 'active', registered: '20 янв 2025', lastActivity: '2 дня назад' },
  { id: 4, name: 'Наталья Козлова', initials: 'НК', email: 'nataly_k@mail.ru', tariff: 'Разовая', status: 'inactive', registered: '10 мар 2025', lastActivity: '5 дней назад' },
]

export default function Users() {
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Пользователи</h1>
        <p className="text-text-secondary text-sm">Всего {users.length} пользователей</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени или email..."
          className="w-full sm:w-96 bg-surface border border-surface-light rounded-lg px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-surface rounded-xl p-4 sm:p-5 border border-surface-light hover:border-primary/30 transition-all">
            <div className="flex items-center justify-between gap-4">
              {/* User Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0">
                  {user.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-text font-medium truncate">{user.name}</p>
                  <p className="text-text-secondary text-xs truncate">@{user.email}</p>
                </div>
              </div>

              {/* Details */}
              <div className="hidden sm:flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="text-text-secondary text-xs">Тариф</p>
                  <p className="text-text font-medium">{user.tariff}</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-xs">Регистрация</p>
                  <p className="text-text font-medium">{user.registered}</p>
                </div>
                <div className="text-center">
                  <p className="text-text-secondary text-xs">Активность</p>
                  <p className="text-text font-medium">{user.lastActivity}</p>
                </div>
              </div>

              {/* Status */}
              <div className={`px-3 py-1.5 text-xs font-medium rounded-lg flex-shrink-0 ${
                user.status === 'active' 
                  ? 'bg-success/10 text-success' 
                  : 'bg-text-muted/10 text-text-muted'
              }`}>
                {user.status === 'active' ? 'активен' : 'неактивен'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}