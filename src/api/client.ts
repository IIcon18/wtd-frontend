const BASE_URL = '/api/v1'

// ── Token storage ─────────────────────────────────────────────────────────────
export const getAccessToken = () => localStorage.getItem('access_token')
export const getRefreshToken = () => localStorage.getItem('refresh_token')

export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access)
  localStorage.setItem('refresh_token', refresh)
}

export const clearTokens = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

// ── Refresh helper ────────────────────────────────────────────────────────────
let isRefreshing = false
let refreshListeners: Array<(token: string) => void> = []

const onRefreshed = (token: string) => {
  refreshListeners.forEach(cb => cb(token))
  refreshListeners = []
}

const addRefreshListener = (cb: (token: string) => void) => {
  refreshListeners.push(cb)
}

async function doRefresh(): Promise<string | null> {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })
  if (!res.ok) return null
  const data = await res.json()
  saveTokens(data.access_token, data.refresh_token)
  return data.access_token
}

// ── Main request function ─────────────────────────────────────────────────────
export async function request<T>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  // Success
  if (res.ok) {
    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
  }

  // Try refresh on 401
  if (res.status === 401 && retry) {
    if (isRefreshing) {
      // Wait for ongoing refresh
      return new Promise<T>((resolve, reject) => {
        addRefreshListener(async _newToken => {
          try {
            resolve(await request<T>(path, options, false))
          } catch (e) {
            reject(e)
          }
        })
      })
    }

    isRefreshing = true
    const newToken = await doRefresh().finally(() => {
      isRefreshing = false
    })

    if (newToken) {
      onRefreshed(newToken)
      return request<T>(path, options, false)
    } else {
      clearTokens()
      window.location.href = '/login'
      throw new Error('Сессия истекла. Войдите снова.')
    }
  }

  // Parse error message from backend
  let message = `Ошибка ${res.status}`
  try {
    const err = await res.json()
    message = err.detail || message
  } catch {}

  throw new Error(message)
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
