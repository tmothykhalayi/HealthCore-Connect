import url from "@/constants/urls";
import {   getAccessTokenHelper } from "@/lib/authHelper";


export const createAppointmentFn = async (appointmentData: {
  doctor_id: number;                                        
    patient_id: number;
    status: string;
    reason: string;
    created_at: Date;
    appointment_time: Date;
}) => {
    const fullUrl = `${url}/appointments`;

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
    const fullUrl = `${url}/appointments`;
    
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
  const fullUrl = `${url}/patients/appointments/${patient_id}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });



  return response.json();
}