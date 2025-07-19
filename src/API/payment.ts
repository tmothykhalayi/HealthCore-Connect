import { API_BASE_URL } from './BaseUrl'

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface Payment {
  userId: number
  orderId: string
  amount: number
  paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer'
  transactionId?: string
  status: PaymentStatus
  relatedEntityType: string
  relatedEntityId: number
}

import { getAccessTokenHelper } from '@/lib/auth'

export const getPaymentsFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Payment[]
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/payments?${params.toString()}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  return response.json()
}

export const deletePaymentsFn = async (paymentId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/payments/${paymentId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete payment')
  }
}
