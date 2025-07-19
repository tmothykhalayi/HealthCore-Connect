
// API/patients.ts
import {API_BASE_URL} from './BaseUrl';
import { getAccessTokenHelper } from '@/lib/auth'
import type { TAppointment } from '@/types/alltypes'

export const getAppointmentsFn = async (patientId: number): Promise<{
  data: TAppointment[];
  total: number;
}> => {


  const fullUrl = `${API_BASE_URL}/appointments`;
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