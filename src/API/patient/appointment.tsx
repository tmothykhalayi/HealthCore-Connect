// API/patients.ts
import { API_BASE_URL } from '../BaseUrl'
import type { TAppointment } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export const getAppointmentsFn = async (
  patientId: number,
): Promise<{
  data: Array<TAppointment>
  total: number
}> => {
  const fullUrl = `${API_BASE_URL}/appointments`
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

export const deleteAppointmentFn = async (
  appointmentId: number,
): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete appointment')
  }
}

export const cancelAppointmentFn = async (
  appointmentId: number,
): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}/cancel`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status: 'cancelled' }),
  })

  if (!response.ok) {
    throw new Error('Failed to cancel appointment')
  }
}

export const rescheduleAppointmentFn = async (
  appointmentId: number,
  newDate: string,
  newTime: string,
): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ 
      appointmentDate: newDate,
      appointmentTime: newTime 
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to reschedule appointment')
  }
}

export const updateAppointmentStatusFn = async (
  appointmentId: number,
  status: string
): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update appointment status')
  }
}
