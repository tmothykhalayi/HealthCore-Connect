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
      'Authorization': `Bearer ${getAccessTokenHelper()}`
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete appointment');
  }
}

export const createAppointmentFn = async (appointmentData: {
  doctor_id: number;
  patient_id: number;
  status: string;
  reason: string;
  created_at: Date;
  appointment_time: Date;
}) => {
  const fullUrl = `${url}/appointments`;
  console.log("appointmentData", appointmentData);
  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(appointmentData),
  });

  // if (!response.ok) {
  //   throw new Error('Failed to create appointment');
  // }
   

  const data = await response.json();
  
  console.log("data", data);
  return data;
};
// API/appointments.ts