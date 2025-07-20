import { API_BASE_URL } from '../BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const getPatientByUserIdFn = async (userId: number) => {
  const fullUrl = `${API_BASE_URL}/patients/user/${userId}`
  const token = getAccessTokenHelper()

  console.log('Fetching patient for user:', fullUrl)

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
    throw new Error(`Failed to fetch patient: ${response.status} ${errorText}`)
  }

  const responseData = await response.json()
  console.log('Patient data:', responseData)
  
  return responseData.data || responseData
}

export const createPatientProfileFn = async (patientData: {
  userId: number
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  phoneNumber: string
  address: string
  emergencyContact: string
  medicalHistory: string
  allergies: string[]
  bloodType: string
  weight: number
  height: number
  status: string
}) => {
  const fullUrl = `${API_BASE_URL}/patients`
  const token = getAccessTokenHelper()

  console.log('Creating patient profile:', fullUrl)

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patientData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', response.status, errorText)
    throw new Error(`Failed to create patient profile: ${response.status} ${errorText}`)
  }

  const responseData = await response.json()
  console.log('Patient created:', responseData)
  
  return responseData.data || responseData
}

export const getAppointmentsByPatientIdFn = async (patientId: number) => {
  const fullUrl = `${API_BASE_URL}/appointments/patient/${patientId}`
  const token = getAccessTokenHelper()

  console.log('Fetching appointments for patient:', fullUrl)

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
    throw new Error(`Failed to fetch appointments: ${response.status} ${errorText}`)
  }

  const responseData = await response.json()
  console.log('Appointments data:', responseData)
  
  return responseData.data || responseData
} 