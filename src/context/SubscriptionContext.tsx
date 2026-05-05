import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getMySubscription } from '../api/subscriptions'
import type { SubscriptionOut } from '../api/types'
import { useAuth } from './AuthContext'

interface SubscriptionContextValue {
  sub: SubscriptionOut | null
  subLoading: boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null)

const POLL_INTERVAL_MS = 30_000 // 30 секунд

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [sub, setSub] = useState<SubscriptionOut | null>(null)
  const [subLoading, setSubLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchSub = useCallback(async () => {
    try {
      const s = await getMySubscription()
      setSub(s)
    } catch {
      setSub(null)
    }
  }, [])

  const refreshSubscription = useCallback(async () => {
    await fetchSub()
  }, [fetchSub])

  useEffect(() => {
    if (!user) {
      setSub(null)
      setSubLoading(false)
      return
    }

    // Первая загрузка
    setSubLoading(true)
    fetchSub().finally(() => setSubLoading(false))

    // Поллинг каждые 30 сек
    timerRef.current = setInterval(() => {
      fetchSub()
    }, POLL_INTERVAL_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [user, fetchSub])

  return (
    <SubscriptionContext.Provider value={{ sub, subLoading, refreshSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSubscription(): SubscriptionContextValue {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return ctx
}
