import { API_BASE_URL } from '../../BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const getPatientPrescriptionsByIdFn = async (patientId: number) => {
  // Use the correct endpoint for fetching a patient's prescriptions
  const fullUrl = `${API_BASE_URL}/patients/${patientId}/prescriptions`
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
