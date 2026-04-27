import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов')
      return
    }
    setLoading(true)
    try {
      await register(email, password, name)
      navigate('/')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ошибка регистрации')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            WD
          </div>
          <h1 className="text-3xl font-bold text-text">WavesToDream</h1>
          <p className="text-text-secondary mt-1">AI-тренер по плаванию</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-surface-light rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-text mb-6">Создать аккаунт</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm mb-2">Имя</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Алексей"
                required
                className="w-full bg-surface-light border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-surface-light border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-surface-light border border-surface-light rounded-xl px-4 py-3 text-text placeholder-text-muted focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрируем...' : 'Создать аккаунт'}
            </button>
          </form>

          <p className="text-text-secondary text-sm text-center mt-6">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
