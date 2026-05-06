import { api } from './client'
import type { UserOut, SubscriptionOut, SubscriptionTier } from './types'

export interface UserWithSubscription {
  user: UserOut
  subscription: SubscriptionOut | null
}

export interface AdminStats {
  total_users: number
  pending_payments: number
  approved_payments: number
  total_revenue: number
}

export interface AdminPayment {
  id: number
  user_id: number
  tier: string
  price: number
  status: 'pending' | 'approved' | 'declined'
  yookassa_payment_id: string | null
  processed_by: number | null
  created_at: string
  updated_at: string
}

// Users
export const adminGetUsers = () =>
  api.get<UserWithSubscription[]>('/admin/users/')

export const adminGrantSubscription = (userId: number, tier: SubscriptionTier, days: number) =>
  api.post<SubscriptionOut>(`/admin/users/${userId}/subscription`, { tier, days })

export const adminRevokeSubscription = (userId: number) =>
  api.delete<void>(`/admin/users/${userId}/subscription`)

// Payments
export const adminGetPendingPayments = () =>
  api.get<AdminPayment[]>('/admin/payments/')

export const adminGetAllPayments = () =>
  api.get<AdminPayment[]>('/admin/payments/all')

export const adminApprovePayment = (paymentId: number) =>
  api.patch<AdminPayment>(`/admin/payments/${paymentId}/approve`, {})

export const adminDeclinePayment = (paymentId: number) =>
  api.patch<AdminPayment>(`/admin/payments/${paymentId}/decline`, {})

// Stats
export const adminGetStats = () =>
  api.get<AdminStats>('/admin/stats/')
