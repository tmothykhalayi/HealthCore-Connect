import { API_BASE_URL} from "./BaseUrl";
import { getAccessTokenHelper } from "@/lib/auth";


//enum for gender

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
// Interface for Patient Profile
export interface patient {
  userId: number;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber: string;
  address: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string[];
  assignedDoctorId?: number;
  bloodType?: string;
  weight?: number;
   height?: number;
   status?: string;

}


import type { TPatient } from "@/types/alltypes";

export const getPatientsFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TPatient[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${API_BASE_URL}/patients?${params.toString()}`;
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

// API/patients.ts
export const createPatientFn = async (patientData: Omit<TPatient, 'patient_id'>): Promise<TPatient> => {
  const fullUrl = `${API_BASE_URL}/patients`;
  const token = getAccessTokenHelper();

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(patientData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create patient');
    }

    return response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const deletePatientFn = async (patientId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/patients/${patientId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete patient');
  }
}

// API/patients.ts
export const getPatientsCount = async (): Promise<{ total: number }> => {
  const response = await fetch(`${API_BASE_URL}/patients/count`, {
    headers: {
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });
  return response.json();
};