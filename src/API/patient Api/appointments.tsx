// API/patients.ts
import url from '@/constants/urls'
import { getAccessTokenHelper } from '@/lib/authHelper'
import type { TAppointment } from '@/Types/types'

export const getAppointmentsFn = async (patientId: number): Promise<{
  data: TAppointment[];
  total: number;
}> => {


  const fullUrl = `${url}/patients/appointments/ ${patientId}`;
  const token = getAccessTokenHelper();


  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const deleteAppointmentFn = async (
  appointmentId: number,
): Promise<void> => {
  const fullUrl = `${url}/appointments/${appointmentId}`

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
