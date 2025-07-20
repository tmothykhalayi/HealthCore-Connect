// API/patients.ts
import { API_BASE_URL } from './BaseUrl'
import type { TAppointment } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export const getAppointmentsFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TAppointment>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/appointments?${params.toString()}`
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
  const mappedData = result.data.map((appointment: any) => ({
    appointment_id: appointment.id,
    patient_id: appointment.patientId || appointment.patient?.id || 0,
    doctor_id: appointment.doctorId || appointment.doctor?.id || 0,
    appointment_time: appointment.appointmentDate,
    status: appointment.status,
    reason: appointment.reason || appointment.title || '',
    created_at: appointment.createdAt,
  }))

  return {
    data: mappedData,
    total: result.total,
  }
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
