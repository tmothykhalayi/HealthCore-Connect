// API/appointments.ts
import { API_BASE_URL } from '../BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

export const getAppointmentsFn = async (doctorId: number) => {
  // Corrected endpoint to fetch appointments for a doctor
  const fullUrl = `${API_BASE_URL}/appointments/doctor/${doctorId}`
  const token = getAccessTokenHelper()

  console.log(`[getAppointmentsFn] Fetching appointments for doctor ${doctorId} from: ${fullUrl}`)

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
  console.log('[getAppointmentsFn] Raw backend response:', result)
  
  // Map backend response to frontend expected format
  const mappedData = result.data.map((appointment: any) => ({
    appointment_id: appointment.id,
    patient_id: appointment.patientId || appointment.patient?.id || 0,
    doctor_id: appointment.doctorId || appointment.doctor?.id || 0,
    patient_name: appointment.patient ? `${appointment.patient.user?.firstName || ''} ${appointment.patient.user?.lastName || ''}`.trim() : '',
    doctor_name: appointment.doctor ? `${appointment.doctor.user?.firstName || ''} ${appointment.doctor.user?.lastName || ''}`.trim() : '',
    appointment_time: appointment.appointmentDate,
    appointment_date: appointment.date,
    appointment_time_slot: appointment.time,
    status: appointment.status,
    reason: appointment.reason || appointment.title || '',
    notes: appointment.notes || '',
    priority: appointment.priority || 'normal',
    duration: appointment.duration || 30,
    created_at: appointment.createdAt,
    // Zoom meeting data
    zoomMeetingId: appointment.zoomMeetingId,
    user_url: appointment.user_url,
    admin_url: appointment.admin_url,
  }))

  console.log('[getAppointmentsFn] Mapped data for frontend:', mappedData)
  return {
    data: mappedData,
    total: result.data.length,
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

export const createAppointmentFn = async (appointmentData: {
  doctor_id: number
  patient_id: number
  status: string
  reason: string
  created_at: Date
  appointment_time: Date
}) => {
  const fullUrl = `${API_BASE_URL}/appointments`
  console.log('appointmentData', appointmentData)
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(appointmentData),
  })

  // if (!response.ok) {
  //   throw new Error('Failed to create appointment');
  // }

  const data = await response.json()

  console.log('data', data)
  return data
}
// API/appointments.ts
