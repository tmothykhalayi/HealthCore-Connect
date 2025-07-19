import { API_BASE_URL } from './BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

//inteface for Order
export interface Order {
  patientId: number
  orderDate: string
  orderStatus: 'pending' | 'completed' | 'cancelled'
  totalAmount: number
  OrderId: string
  pharmacyId: string
}

import type { TPharmacyOrder } from '@/types/alltypes'

export const getPharmacyOrdersFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: TPharmacyOrder[]
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/pharmacy-orders?${params.toString()}`
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

export const deletePharmacyOrderFn = async (orderId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/pharmacy-orders/${orderId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete pharmacy order')
  }
}
