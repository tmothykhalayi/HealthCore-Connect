// Interface for Doctor Profile
// API/users.ts
import { API_BASE_URL } from './BaseUrl'
import type { TDoctor } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export interface doctor {
  userId: number
  specialization: string
  licenseNumber: string
  yearsOfExperience: number
  phoneNumber: string
  education?: string
  officeAddress: string
  consultationFee?: number
  availableDays?: Array<string>
  availableHours?: string
  status?: string
}

export const getDoctorFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TDoctor>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/doctors?${params.toString()}`
  const token = getAccessTokenHelper()

  console.log(`[getDoctorFn] Fetching doctors from: ${fullUrl}`);

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

  const result = await response.json();
  console.log('[getDoctorFn] Raw backend response:', result);
  
  const mappedData = {
    data: result.data.map((doctor: any) => ({
      doctor_id: doctor.id,
      name: doctor.user ? `${doctor.user.firstName} ${doctor.user.lastName}` : '',
      email: doctor.user?.email,
      specialization: doctor.specialization,
      license_number: doctor.licenseNumber,
      consultation_fee: doctor.consultationFee,
      availability: Array.isArray(doctor.availableDays) ? doctor.availableDays.join(', ') : '',
      // Add more mappings as needed
    })),
    total: result.total,
  };
  
  console.log('[getDoctorFn] Mapped data for frontend:', mappedData);
  return mappedData;
}

export const deleteDoctorFn = async (doctorId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/doctors/${doctorId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete user')
  }
}

export const getDoctorByIdFn = async (doctorId: number): Promise<TDoctor> => {
  const fullUrl = `${API_BASE_URL}/doctors/${doctorId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch doctor')
  }

  return response.json()
}

export const createDoctorFn = async (doctorData: any): Promise<any> => {
  const fullUrl = `${API_BASE_URL}/doctors`;
  const token = getAccessTokenHelper();

  // Map frontend fields to backend fields if needed
  const payload = {
    userId: doctorData.userId,
    specialization: doctorData.specialization,
    licenseNumber: doctorData.license_number,
    yearsOfExperience: doctorData.yearsOfExperience,
    phoneNumber: doctorData.phoneNumber,
    education: doctorData.education,
    officeAddress: doctorData.officeAddress,
    consultationFee: doctorData.consultation_fee,
    availableDays: doctorData.availableDays,
    availableHours: doctorData.availableHours,
    status: doctorData.status,
  };

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create doctor');
  }

  return response.json();
};

export const updateDoctorFn = async (doctorId: number, doctorData: any): Promise<any> => {
  const fullUrl = `${API_BASE_URL}/doctors/${doctorId}`;
  const token = getAccessTokenHelper();

  console.log('Frontend sending doctor data:', doctorData);

  // Map frontend fields (snake_case) to backend fields (camelCase)
  const payload = {
    specialization: doctorData.specialization,
    licenseNumber: doctorData.license_number,
    consultationFee: doctorData.consultation_fee,
    availableDays: doctorData.availability ? doctorData.availability.split(',').map((s: string) => s.trim()) : undefined,
  };

  console.log('Mapped payload for backend:', payload);

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update doctor error response:', errorText);
    throw new Error(`Failed to update doctor: ${errorText}`);
  }

  const result = await response.json();
  console.log('Update doctor response:', result);
  return result;
};
