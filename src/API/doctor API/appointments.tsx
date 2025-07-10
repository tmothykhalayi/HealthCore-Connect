// API/appointments.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";

export const getAppointmentsFn = async (doctorId: number) => {

  const fullUrl = `${url}/doctors/${doctorId}`;
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


export const deleteAppointmentFn = async (appointmentId: number): Promise<void> => {
  const fullUrl = `${url}/appointments/${appointmentId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
}