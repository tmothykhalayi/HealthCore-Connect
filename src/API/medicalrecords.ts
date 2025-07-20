// API/records.ts
import { API_BASE_URL } from './BaseUrl'
import type { TRecord, CreateRecordData, UpdateRecordData } from '@/types/alltypes'
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

  const fullUrl = `${API_BASE_URL}/medical-records?${params.toString()}`
  const token = getAccessTokenHelper()

  console.log('Fetching records from:', fullUrl)

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  console.log('Response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Failed to fetch records:', errorText)
    throw new Error('Network response was not ok')
  }

  const result = await response.json()
  console.log('Records response:', result)
  
  return {
    data: result.data || [],
    total: result.total || 0,
  }
}

export const deleteRecordFn = async (recordId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/medical-records/${recordId}`

  console.log('Deleting record:', fullUrl)

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Delete failed:', errorText)
    throw new Error('Failed to delete record')
  }
}

export const createRecordFn = async (recordData: CreateRecordData): Promise<TRecord> => {
  const fullUrl = `${API_BASE_URL}/medical-records`

  console.log('Creating record:', fullUrl, recordData)

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(recordData),
  })

  console.log('Create response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Create failed:', errorText)
    throw new Error('Failed to create record')
  }

  const result = await response.json()
  console.log('Create response:', result)
  return result.data
}

export const updateRecordFn = async (
  recordId: number,
  recordData: UpdateRecordData
): Promise<TRecord> => {
  const fullUrl = `${API_BASE_URL}/medical-records/${recordId}`

  console.log('Updating record:', fullUrl, recordData)

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(recordData),
  })

  console.log('Update response status:', response.status)

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Update failed:', errorText)
    throw new Error('Failed to update record')
  }

  const result = await response.json()
  console.log('Update response:', result)
  return result.data
}
