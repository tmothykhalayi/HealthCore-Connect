// API/records.ts
import { API_BASE_URL } from './BaseUrl'
import type { TRecord } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export const getRecordFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TRecord>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/records?${params.toString()}`
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

export const deleteRecordFn = async (recordId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/records/${recordId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete record')
  }
}

export const createRecordFn = async (recordData: TRecord): Promise<TRecord> => {
  const fullUrl = `${API_BASE_URL}/records`

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(recordData),
  })

  if (!response.ok) {
    throw new Error('Failed to create record')
  }

  return response.json()
}
