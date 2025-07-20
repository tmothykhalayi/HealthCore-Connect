import { API_BASE_URL } from './BaseUrl'

import { getAccessTokenHelper } from '@/lib/auth'

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

export const getPaymentsFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<Payment>
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

  const result = await response.json()
  
  // Map backend response to frontend expected format
  const mappedData = result.data.map((payment: any) => ({
    payment_id: payment.id,
    appointment_id: payment.relatedEntityId || 0,
    patient_id: payment.userId || 0,
    payment_method: payment.paymentMethod,
    pharmacy_order_id: payment.orderId || 0,
    created_at: payment.createdAt,
    amount: payment.amount,
    status: payment.status,
  }))

  return {
    data: mappedData,
    total: result.total,
  }
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
