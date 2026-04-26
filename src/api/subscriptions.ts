import { api } from './client'
import type { SubscriptionOut } from './types'

export const getMySubscription = () =>
  api.get<SubscriptionOut | null>('/subscriptions/me')

export const activateTestSubscription = () =>
  api.post<SubscriptionOut>('/subscriptions/activate-test')
