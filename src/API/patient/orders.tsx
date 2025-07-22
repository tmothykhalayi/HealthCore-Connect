import { API_BASE_URL } from '../BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const getPharmacyOrdersFn = async (patientId: number) => {
  // Use the correct backend endpoint
  const fullUrl = `${API_BASE_URL}/orders/patient/${patientId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacy orders')
  }

  const data = await response.json()
  // Return the data array from the backend response
  return data.data || []
}

export const createPharmacyOrderFn = async (orderData: any) => {
  const fullUrl = `${API_BASE_URL}/orders`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  })

  if (!response.ok) {
    throw new Error('Failed to create pharmacy order')
  }

  return await response.json()
}
