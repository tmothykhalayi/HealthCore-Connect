import type { TMedicine } from '@/types/alltypes'

// Fetch medicines for a patient (or all medicines if patientId not needed)
export const getMedicineFn = async (page = 1, limit = 10, search = '', userId?: number, doctorId?: number): Promise<{
  data: Array<TMedicine>
  total: number
}> => {
  let fullUrl = '';
  if (userId) {
    const params = new URLSearchParams({
      ...(doctorId ? { doctorId: doctorId.toString() } : {}),
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    fullUrl = `${API_BASE_URL}/medicines/user/${userId}?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search,
    });
    fullUrl = `${API_BASE_URL}/medicines?${params.toString()}`;
  }
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
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
