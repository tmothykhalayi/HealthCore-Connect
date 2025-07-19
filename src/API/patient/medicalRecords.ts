import { API_BASE_URL } from '../BaseUrl'
import type { TRecord } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export const getPatientMedicalRecordsFn = async (patientId: number): Promise<{
  data: Array<TRecord>
}> => {
  const fullUrl = `${API_BASE_URL}/medical-records/patient/${patientId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch patient medical records')
  }

  const result = await response.json()
  return {
    data: result.data || result || []
  }
} 