import { API_BASE_URL } from './BaseUrl';
import { getAccessTokenHelper } from '@/lib/auth';
import type { TDoctor } from '@/types/alltypes';

// Fetch doctor profile by user ID
export const getDoctorByUserIdFn = async (userId: string | number): Promise<TDoctor> => {
  const fullUrl = `${API_BASE_URL}/doctors/user/${userId}`;
  const token = getAccessTokenHelper();

  console.log(`[getDoctorByUserIdFn] Fetching doctor profile for userId: ${userId}`);
  console.log(`[getDoctorByUserIdFn] URL: ${fullUrl}`);

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    console.error(`[getDoctorByUserIdFn] Error response: ${response.status} ${response.statusText}`);
    throw new Error('Failed to fetch doctor profile');
  }

  const result = await response.json();
  console.log(`[getDoctorByUserIdFn] Response:`, result);
  return result;
};


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

  console.log('=== UPDATE DOCTOR DEBUG ===');
  console.log('doctorId:', doctorId);
  console.log('Raw doctorData received:', doctorData);
  console.log('Token available:', !!token);

  // Map all possible fields from the form/state to backend fields
  // Use the exact field names that the backend expects (camelCase)
  const payload: any = {};
  
  // Only include fields that are actually provided and not empty
  if (doctorData.specialization) payload.specialization = doctorData.specialization;
  if (doctorData.licenseNumber) payload.licenseNumber = doctorData.licenseNumber;
  if (doctorData.consultationFee !== undefined && doctorData.consultationFee !== null) payload.consultationFee = doctorData.consultationFee;
  if (doctorData.availableDays && Array.isArray(doctorData.availableDays)) payload.availableDays = doctorData.availableDays;
  if (doctorData.phoneNumber) payload.phoneNumber = doctorData.phoneNumber;
  if (doctorData.officeAddress) payload.officeAddress = doctorData.officeAddress;
  if (doctorData.yearsOfExperience !== undefined && doctorData.yearsOfExperience !== null) payload.yearsOfExperience = doctorData.yearsOfExperience;
  if (doctorData.education) payload.education = doctorData.education;
  if (doctorData.availableHours) payload.availableHours = doctorData.availableHours;
  if (doctorData.status) payload.status = doctorData.status;
  if (doctorData.bio) payload.bio = doctorData.bio;

  // Additional cleanup for any remaining empty values
  Object.keys(payload).forEach(key => {
    if (payload[key] === undefined || payload[key] === null || payload[key] === '') {
      delete payload[key];
    }
  });

  console.log('Final payload after cleanup:', payload);
  console.log('Payload JSON:', JSON.stringify(payload, null, 2));

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
    console.error('Response status:', response.status);
    console.error('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // Try to parse the error response as JSON for better error messages
    try {
      const errorJson = JSON.parse(errorText);
      console.error('Parsed error response:', errorJson);
      throw new Error(`Failed to update doctor: ${JSON.stringify(errorJson, null, 2)}`);
    } catch (parseError) {
      throw new Error(`Failed to update doctor: ${errorText}`);
    }
  }

  const result = await response.json();
  console.log('Update doctor success response:', result);
  console.log('Response status was:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));
  return result;
};
