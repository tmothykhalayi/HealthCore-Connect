import { API_BASE_URL } from './BaseUrl'

import { getAccessTokenHelper, getUserIdHelper } from '@/lib/auth'

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

export interface CreatePaymentData {
  userId: number
  orderId: string
  amount: number
  paymentMethod: string
  status: PaymentStatus
  relatedEntityType: string
  relatedEntityId: number
  transactionId: string
}

export interface UpdatePaymentData {
  userId?: number
  orderId?: string
  amount?: number
  paymentMethod?: string
  status?: PaymentStatus
  relatedEntityType?: string
  relatedEntityId?: number
  transactionId?: string
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

// Get all payments for admin dashboard
export const getAllPaymentsFn = async (): Promise<Array<any>> => {
  const fullUrl = `${API_BASE_URL}/payments/admin/all`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch all payments')
  }

  const data = await response.json()
  return data.data || data || []
}

// Get payments for pharmacist (fetch all payments from database)
export const getPharmacistPaymentsFn = async (): Promise<Array<any>> => {
  const token = getAccessTokenHelper()
  
  if (!token) {
    throw new Error('Authentication token not found')
  }

  const userId = getUserIdHelper()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  console.log('Fetching all payments for pharmacist, userId:', userId)

  try {
    // Fetch all payments from the database
    const paymentsResponse = await fetch(`${API_BASE_URL}/payments/admin/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!paymentsResponse.ok) {
      console.error('Payments response not ok:', paymentsResponse.status, paymentsResponse.statusText)
      const errorText = await paymentsResponse.text()
      console.error('Payments error details:', errorText)
      throw new Error(`Failed to fetch payments: ${paymentsResponse.status} ${paymentsResponse.statusText}`)
    }

    const data = await paymentsResponse.json()
    console.log('All payments data received:', data)

    // Return the data array, handling different response structures
    const payments = data.data || data || []
    console.log('Returning all payments:', payments.length)
    return payments

  } catch (error) {
    console.error('Error in getPharmacistPaymentsFn:', error)
    throw error
  }
}

export const createPaymentFn = async (paymentData: CreatePaymentData): Promise<Payment> => {
  const fullUrl = `${API_BASE_URL}/payments`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    throw new Error('Failed to create payment')
  }

  const result = await response.json()
  return result.data
}

export const updatePaymentFn = async (
  paymentId: number,
  paymentData: UpdatePaymentData
): Promise<Payment> => {
  const fullUrl = `${API_BASE_URL}/payments/${paymentId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(paymentData),
  })

  if (!response.ok) {
    throw new Error('Failed to update payment')
  }

  const result = await response.json()
  return result.data
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

export const deletePaymentAdminFn = async (paymentId: string): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/payments/admin/${paymentId}`

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
