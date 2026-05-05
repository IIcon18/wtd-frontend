import { api } from './client'

export type PaymentTier = 'single' | 'base' | 'pro'

export interface PaymentCreateResponse {
  payment_id: number
  confirmation_url: string
  price: number
}

export interface PaymentOut {
  id: number
  user_id: number
  tier: PaymentTier
  price: number
  yookassa_payment_id: string | null
  status: 'pending' | 'approved' | 'declined'
  processed_by: number | null
  created_at: string
  updated_at: string
}

export interface ConfirmResponse {
  status: 'activated' | 'already_active' | 'pending' | 'failed'
}

export const createPayment = (tier: PaymentTier) =>
  api.post<PaymentCreateResponse>('/payments/create', { tier })

export const confirmPayment = (paymentId: number) =>
  api.post<ConfirmResponse>(`/payments/${paymentId}/confirm`, {})

export const getMyPayments = () =>
  api.get<PaymentOut[]>('/payments/me')
