import { API_BASE_URL } from '../../BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const getDoctorsFn = async () => {
  const fullUrl = `${API_BASE_URL}/doctors`
  const token = getAccessTokenHelper()

  console.log('Fetching doctors from:', fullUrl)

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', response.status, errorText)
    throw new Error(`Failed to fetch doctors: ${response.status} ${errorText}`)
  }

  const responseData = await response.json()
  console.log('Raw doctors response:', responseData)
  
  // Extract the data array from the response
  const doctors = responseData.data || responseData
  console.log('Extracted doctors:', doctors)
  
  // Transform the data to match frontend expectations
  const transformedDoctors = Array.isArray(doctors) ? doctors.map(doctor => ({
    doctor_id: doctor.id,
    name: `${doctor.user?.firstName || ''} ${doctor.user?.lastName || ''}`.trim(),
    specialization: doctor.specialization || 'General Practice',
    email: doctor.user?.email || '',
    availability: doctor.availableHours || 'Not specified',
    consultation_fee: doctor.consultationFee || 0,
    img: null // No image field in current structure
  })) : []
  
  console.log('Transformed doctors:', transformedDoctors)
  return transformedDoctors
}
