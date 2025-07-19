import {API_BASE_URL} from "../../BaseUrl";
import {   getAccessTokenHelper } from "@/lib/auth";


export const createAppointmentFn = async (appointmentData: {
  doctor_id: number;                                        
    patient_id: number;
    status: string;
    reason: string;
    created_at: Date;
    appointment_time: Date;
}) => {
    const fullUrl = `${API_BASE_URL}/appointments`;

    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAccessTokenHelper()}`,
        },
        body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
        throw new Error('Failed to create appointment');
    }

    return response.json();
};

export const postAppointmentFn = async () => {
    const fullUrl = `${API_BASE_URL}/appointments`;
    
    const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAccessTokenHelper()}`,
        },
    });
    
    if (!response.ok) {
        throw new Error('Failed to post appointment');
    }
    
    return response.json();
}

export const getAppointmentsFn = async (patient_id: number) => {
  const fullUrl = `${API_BASE_URL}/patients/appointments/${patient_id}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  return Array.isArray(data) ? data : [data];
}