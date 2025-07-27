import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAccessTokenHelper } from '@/lib/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

interface PatientPayment {
  id: string
  fullName: string
  email: string
  phoneNumber: string
  amount: number
  status: 'pending' | 'success' | 'failed' | 'cancelled' | 'refunded'
  type: 'appointment' | 'order'
  paystackReference: string
  createdAt: string
  updatedAt: string
  order?: {
    id: number
    status: string
  }
}

interface CreatePaymentData {
  fullName: string
  email: string
  phoneNumber: string
  amount: number
  type: 'appointment' | 'order'
  orderId?: number
  returnUrl?: string
  notes?: string
}

// Fetch patient payments
const getPatientPaymentsFn = async (): Promise<PatientPayment[]> => {
  const token = getAccessTokenHelper()
  
  const response = await fetch(`${API_BASE_URL}/payments`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch payments')
  }

  const data = await response.json()
  return data.data || data || []
}

// Initialize payment
const initializePaymentFn = async (paymentData: CreatePaymentData): Promise<any> => {
  const token = getAccessTokenHelper()
  
  const response = await fetch(`${API_BASE_URL}/payments/initialize`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to initialize payment')
  }

  return response.json()
}

// Verify payment
const verifyPaymentFn = async (reference: string): Promise<any> => {
  const token = getAccessTokenHelper()
  
  const response = await fetch(`${API_BASE_URL}/payments/verify/${reference}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to verify payment')
  }

  return response.json()
}

// Cancel payment
const cancelPaymentFn = async (paymentId: string): Promise<any> => {
  const token = getAccessTokenHelper()
  
  const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to cancel payment')
  }

  return response.json()
}

// Hooks
export const useGetPatientPayments = () => {
  return useQuery({
    queryKey: ['patient-payments'],
    queryFn: getPatientPaymentsFn,
  })
}

export const useInitializePayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: initializePaymentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-payments'] })
    },
  })
}

export const useVerifyPayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: verifyPaymentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-payments'] })
    },
  })
}

export const useCancelPayment = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: cancelPaymentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patient-payments'] })
    },
  })
} 