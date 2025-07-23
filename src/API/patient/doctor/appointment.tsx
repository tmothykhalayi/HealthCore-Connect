import { API_BASE_URL } from '../../BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const createAppointmentFn = async (appointmentData: {
  doctorId: number
  patientId: number
  appointmentDate: string
  appointmentTime: string
  patientEmail: string
  duration: number
  reason: string
  status: string
  date: string
  time: string
  title: string
}) => {
  const fullUrl = `${API_BASE_URL}/appointments`

  // Exclude appointmentDate from the payload
  const { appointmentDate, ...payload } = appointmentData;

  console.log('Creating appointment with data:', payload)

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('API Error:', response.status, errorText)
    throw new Error(`Failed to create appointment: ${response.status} ${errorText}`)
  }

  const responseData = await response.json()
  console.log('Appointment created successfully:', responseData)
  return responseData
}

export const postAppointmentFn = async () => {
  const fullUrl = `${API_BASE_URL}/appointments`

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to post appointment')
  }

  return response.json()
}

export const getAppointmentsFn = async (patient_id: number) => {
  const fullUrl = `${API_BASE_URL}/appointments/patient/${patient_id}`
  const token = getAccessTokenHelper()

  console.log('Fetching appointments from:', fullUrl)
  console.log('Patient ID:', patient_id)

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
  console.log('API Response:', responseData)

  // Extract the data array from the response
  const appointments = responseData.data || responseData

  return Array.isArray(appointments) ? appointments : [appointments]
}
