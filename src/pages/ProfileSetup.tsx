import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createSwimProfile } from '../api/swimProfile'
import { useAuth } from '../context/AuthContext'
import type { SwimLevel, SwimGoal, SessionsPerWeek, SessionKm, PoolSize } from '../api/types'

const STEPS = [
  {
    key: 'level',
    title: 'Каков ваш уровень плавания?',
    subtitle: 'Это поможет подобрать подходящие тренировки',
    options: [
      { value: 'beginner', label: 'Начинающий', desc: 'Плаваю редко или недавно начал' },
      { value: 'intermediate', label: 'Средний', desc: 'Регулярно тренируюсь, знаю основы техники' },
      { value: 'advanced', label: 'Продвинутый', desc: 'Серьёзные тренировки, работаю над результатом' },
    ],
  },
  {
    key: 'goal',
    title: 'Какова ваша главная цель?',
    subtitle: 'На основе цели строится программа тренировок',
    options: [
      { value: 'weight_loss', label: 'Похудение', desc: 'Сжечь жир, улучшить фигуру' },
      { value: 'endurance', label: 'Выносливость', desc: 'Плавать дольше и дальше без усталости' },
      { value: 'technique', label: 'Техника', desc: 'Правильные движения и эффективность гребка' },
      { value: 'competition', label: 'Соревнования', desc: 'Готовлюсь к соревнованиям, нужен результат' },
    ],
  },
  {
    key: 'sessions_per_week',
    title: 'Как часто вы тренируетесь?',
    subtitle: 'Укажите реальную частоту, чтобы план был выполнимым',
    options: [
      { value: '2', label: '2 раза в неделю', desc: 'Лёгкий режим, поддержание формы' },
      { value: '3', label: '3 раза в неделю', desc: 'Оптимальный баланс нагрузки' },
      { value: '5', label: '5 раз в неделю', desc: 'Интенсивный режим, серьёзный прогресс' },
    ],
  },
  {
    key: 'session_km',
    title: 'Сколько метров за тренировку?',
    subtitle: 'Примерный объём одной тренировки',
    options: [
      { value: '1000', label: '1 000 м', desc: '~30 минут в бассейне' },
      { value: '1500', label: '1 500 м', desc: '~45 минут в бассейне' },
      { value: '2000', label: '2 000 м', desc: '~60 минут в бассейне' },
      { value: '2500+', label: '2 500+ м', desc: 'Более часа, серьёзный объём' },
    ],
  },
  {
    key: 'pool_meters',
    title: 'Длина вашего бассейна?',
    subtitle: 'Влияет на расчёт количества отрезков',
    options: [
      { value: '25', label: '25 метров', desc: 'Стандартный короткий бассейн' },
      { value: '50', label: '50 метров', desc: 'Олимпийский длинный бассейн' },
    ],
  },
]

type FormData = {
  level: SwimLevel
  goal: SwimGoal
  sessions_per_week: SessionsPerWeek
  session_km: SessionKm
  pool_meters: PoolSize
}

export default function ProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    level: '' as SwimLevel,
    goal: '' as SwimGoal,
    sessions_per_week: '' as SessionsPerWeek,
    session_km: '' as SessionKm,
    pool_meters: '' as PoolSize,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const currentStep = STEPS[step]
  const currentKey = currentStep.key as keyof FormData
  const currentValue = form[currentKey]

  const handleSelect = (value: string) => {
    setForm(f => ({ ...f, [currentKey]: value }))
  }

  const handleNext = async () => {
    if (!form[currentKey]) return
    if (step < STEPS.length - 1) {
      setStep(s => s + 1)
      return
    }
    setSaving(true)
    setError('')
    try {
      await createSwimProfile(form)
      navigate('/')
    } catch {
      setError('Не удалось сохранить профиль. Попробуйте ещё раз.')
    } finally {
      setSaving(false)
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const progress = ((step + (currentValue ? 1 : 0)) / STEPS.length) * 100

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
            WD
          </div>
          <h1 className="text-2xl font-bold text-text">
            Добро пожаловать{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-text-secondary mt-1 text-sm">
            Настроим профиль пловца — займёт меньше минуты
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-text-secondary mb-2">
            <span>Шаг {step + 1} из {STEPS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-surface-light rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface border border-surface-light rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text mb-1">{currentStep.title}</h2>
          <p className="text-text-secondary text-sm mb-6">{currentStep.subtitle}</p>

          <div className="space-y-3">
            {currentStep.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left px-4 py-4 rounded-xl border-2 transition-all duration-200 ${
                  currentValue === opt.value
                    ? 'border-primary bg-primary/10'
                    : 'border-surface-light hover:border-primary/40 hover:bg-surface-light/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-colors ${
                    currentValue === opt.value
                      ? 'border-primary bg-primary'
                      : 'border-surface-light'
                  }`}>
                    {currentValue === opt.value && (
                      <div className="w-full h-full rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${currentValue === opt.value ? 'text-primary' : 'text-text'}`}>
                      {opt.label}
                    </div>
                    <div className="text-text-secondary text-xs mt-0.5">{opt.desc}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3 mt-4">
              {error}
            </p>
          )}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="flex-1 py-3 rounded-xl border border-surface-light text-text-secondary hover:text-text hover:border-primary/40 transition-colors font-medium text-sm"
              >
                Назад
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!currentValue || saving}
              className="flex-1 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
            >
              {saving
                ? 'Сохраняем...'
                : step === STEPS.length - 1
                  ? 'Готово — начать тренировки'
                  : 'Далее →'}
            </button>
          </div>
        </div>

        {/* Skip */}
        <p className="text-center mt-4">
          <button
            onClick={() => navigate('/')}
            className="text-text-muted text-xs hover:text-text-secondary transition-colors"
          >
            Пропустить, настрою позже
          </button>
        </p>
      </div>
    </div>
  )
}
