import { api } from './client'
import type { SubscriptionOut } from './types'

export const getMySubscription = () =>
  api.get<SubscriptionOut | null>('/subscriptions/me')
