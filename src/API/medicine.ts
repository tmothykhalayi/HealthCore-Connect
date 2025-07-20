// inteface medicine.ts

// API/patients.ts
import { API_BASE_URL } from './BaseUrl'
import type { TMedicine } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export interface Medicine {
  userId: number
  name: string
  description: string
  manufacturer: string
  price: number
  expiryDate: string
  category?: string
  dosageForm?: string
  strength?: string
  prescriptionRequired?: boolean
  status?: string
  stockQuantity?: number
  minimumStockLevel?: number
}

export const getMedicinesFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TMedicine>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/medicines?${params.toString()}`
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
  const mappedData = result.data.map((medicine: any) => ({
    medicine_id: medicine.id,
    name: medicine.name,
    description: medicine.description,
    stock_quantity: medicine.stockQuantity || 0,
    price: medicine.price,
    expiry_date: medicine.expiryDate,
  }))

  return {
    data: mappedData,
    total: result.total,
  }
}

export const deleteMedicinesFn = async (medicineId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/medicines/${medicineId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete medicine')
  }
}

export const createMedicineFn = async (
  medicine: TMedicine,
): Promise<TMedicine> => {
  const fullUrl = `${API_BASE_URL}/medicines`

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(medicine),
  })

  if (!response.ok) {
    throw new Error('Failed to create medicine')
  }

  return response.json()
}
