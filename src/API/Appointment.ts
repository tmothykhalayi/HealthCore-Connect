// API/Appointment.ts
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

  console.log(`[getAppointmentsFn] Fetching appointments from: ${fullUrl}`);

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
  console.log('[getAppointmentsFn] Raw backend response:', result);
  
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
  }))

  console.log('[getAppointmentsFn] Mapped data for frontend:', mappedData);
  return {
    data: mappedData,
    total: result.total,
  }
}

export const getAppointmentByIdFn = async (appointmentId: number): Promise<TAppointment> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch appointment')
  }

  const appointment = await response.json()
  
  // Map backend response to frontend expected format
  return {
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
  }
}

export const createAppointmentFn = async (appointmentData: any): Promise<any> => {
  const fullUrl = `${API_BASE_URL}/appointments`
  const token = getAccessTokenHelper()

  console.log('Frontend sending appointment data:', appointmentData);

  // Map frontend fields to backend expected fields
  const payload = {
    patientId: appointmentData.patient_id,
    doctorId: appointmentData.doctor_id,
    appointmentDate: appointmentData.appointment_date, // FIXED: use the snake_case field from the form
    appointmentTime: appointmentData.appointment_time_slot,
    patientEmail: appointmentData.patient_email || '',
    duration: appointmentData.duration || 30,
    reason: appointmentData.reason,
    status: appointmentData.status || 'scheduled',
    priority: appointmentData.priority || 'normal',
    notes: appointmentData.notes || '',
    date: appointmentData.appointment_date,
    time: appointmentData.appointment_time_slot,
    title: appointmentData.reason,
  };

  console.log('Mapped payload for backend:', payload);

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Create appointment error response:', errorText);
    throw new Error(`Failed to create appointment: ${errorText}`);
  }

  const result = await response.json();
  console.log('Create appointment response:', result);
  return result;
}

export const updateAppointmentFn = async (appointmentId: number, appointmentData: any): Promise<any> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}`
  const token = getAccessTokenHelper()

  console.log('Frontend sending appointment update data:', appointmentData);

  // Map frontend fields to backend expected fields
  const payload = {
    appointmentDate: appointmentData.appointment_date, // FIXED: use the snake_case field from the form
    appointmentTime: appointmentData.appointment_time_slot,
    duration: appointmentData.duration,
    reason: appointmentData.reason,
    status: appointmentData.status,
    priority: appointmentData.priority,
    notes: appointmentData.notes,
    date: appointmentData.appointment_date,
    time: appointmentData.appointment_time_slot,
    title: appointmentData.reason,
  };

  console.log('Mapped payload for backend:', payload);

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update appointment error response:', errorText);
    throw new Error(`Failed to update appointment: ${errorText}`);
  }

  const result = await response.json();
  console.log('Update appointment response:', result);
  return result;
}

export const deleteAppointmentFn = async (
  appointmentId: number,
): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/appointments/${appointmentId}`
  const token = getAccessTokenHelper()

  console.log(`[deleteAppointmentFn] Deleting appointment ${appointmentId}`);

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Delete appointment error response:', errorText);
    throw new Error(`Failed to delete appointment: ${errorText}`);
  }

  console.log(`[deleteAppointmentFn] Successfully deleted appointment ${appointmentId}`);
}
