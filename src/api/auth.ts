import { clearTokens, saveTokens } from './client'
import type { TokenResponse } from './types'

const BASE_URL = '/api/v1'

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Неверный email или пароль')
  }
  const data: TokenResponse = await res.json()
  saveTokens(data.access_token, data.refresh_token)
  return data
}

export async function register(
  email: string,
  password: string,
  name: string,
): Promise<TokenResponse> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Ошибка регистрации')
  }
  const data: TokenResponse = await res.json()
  saveTokens(data.access_token, data.refresh_token)
  return data
}

export async function logout(): Promise<void> {
  const { getRefreshToken } = await import('./client')
  const refreshToken = getRefreshToken()
  if (refreshToken) {
    await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    }).catch(() => {})
  }
  clearTokens()
}
