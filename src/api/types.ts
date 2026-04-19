// ── Auth ─────────────────────────────────────────────────────────────────────
export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface UserOut {
  id: number
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}

// ── Swim Profile ──────────────────────────────────────────────────────────────
export type SwimLevel = 'beginner' | 'intermediate' | 'advanced'
export type SwimGoal = 'weight_loss' | 'endurance' | 'technique' | 'competition'
export type SessionsPerWeek = '2' | '3' | '5'
export type SessionKm = '1000' | '1500' | '2000' | '2500+'
export type PoolSize = '25' | '50'

export interface SwimProfileOut {
  id: number
  user_id: number
  level: SwimLevel
  goal: SwimGoal
  sessions_per_week: SessionsPerWeek
  session_km: SessionKm
  pool_meters: PoolSize
  single_workout_available: boolean
  created_at: string
  updated_at: string
}

export interface SwimProfileCreate {
  level: SwimLevel
  goal: SwimGoal
  sessions_per_week: SessionsPerWeek
  session_km: SessionKm
  pool_meters: PoolSize
}

// ── Chat ──────────────────────────────────────────────────────────────────────
export interface ChatResponse {
  reply: string
  session_id: number | null
}

export interface ChatHistoryItem {
  id: number
  workout_type: string
  duration_min: number
  distance_m: number
  content: string
  created_at: string
}

// ── Subscription ──────────────────────────────────────────────────────────────
export type SubscriptionTier = 'base' | 'pro'

export interface SubscriptionOut {
  id: number
  user_id: number
  tier: SubscriptionTier
  started_at: string
  expires_at: string
  is_active: boolean
  ai_requests_today: number
  last_request_date: string | null
}
