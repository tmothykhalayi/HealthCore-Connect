import { API_BASE_URL } from './BaseUrl'
import type { TPatient } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'


// enum for gender

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}
// Interface for Patient Profile
export interface patient {
  id?: number
  userId: number
  dateOfBirth: string
  gender: Gender
  phoneNumber: string
  address: string
  emergencyContact?: string
  medicalHistory?: string
  allergies?: Array<string>
  assignedDoctorId?: number
  bloodType?: string
  weight?: number
  height?: number
  status?: string
}

// Get all patients without pagination (backend doesn't support pagination params)
export const getAllPatientsFn = async (): Promise<Array<any>> => {
  const fullUrl = `${API_BASE_URL}/patients`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch patients')
  }

  const data = await response.json()
  const patients = data.data || data // Handle both response formats

  // Map to the shape expected by PatientsTable, without gender
  return (patients || []).map((patient: any) => ({
    patient_id: patient.id,
    name: patient.user
      ? `${patient.user.firstName || ''} ${patient.user.lastName || ''}`.trim()
      : '',
    email: patient.user?.email || '',
    dob: patient.dateOfBirth || '',
    // gender: patient.user?.gender || '', // Removed
    phone: patient.user?.phoneNumber || patient.phoneNumber || '',
    address: patient.address || '',
  }))
}

export const getPatientsFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TPatient>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/patients?${params.toString()}`
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

  const result = await response.json()

  // Map backend data to frontend expected shape
  const mappedData = (result.data || []).map((patient: any) => ({
    patient_id: patient.id,
    name: patient.user
      ? `${patient.user.firstName || ''} ${patient.user.lastName || ''}`.trim()
      : '',
    email: patient.user?.email || '',
    dob: patient.dateOfBirth || '',
    gender: patient.user?.gender || '', // If available
    phone: patient.user?.phoneNumber || patient.phoneNumber || '',
    address: patient.address || '',
  }))

  return {
    data: mappedData,
    total: result.total || mappedData.length,
  }
}

// API/patients.ts
export const createPatientFn = async (
  patientData: Omit<TPatient, 'patient_id'>,
): Promise<TPatient> => {
  const fullUrl = `${API_BASE_URL}/patients`
  const token = getAccessTokenHelper()

  try {
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patientData),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to create patient')
    }

    return response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const deletePatientFn = async (patientId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/patients/${patientId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete patient')
  }
}

// Update patient profile
export const updatePatientFn = async (
  patientId: number,
  patientData: Partial<patient>,
): Promise<{ message: string }> => {
  const fullUrl = `${API_BASE_URL}/patients/${patientId}`
  const token = getAccessTokenHelper()

  console.log('Frontend sending update request:', {
    url: fullUrl,
    patientId,
    patientData
  })

  try {
    const response = await fetch(fullUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(patientData),
    })

    console.log('Backend response status:', response.status)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Backend error:', errorData)
      throw new Error(errorData.message || 'Failed to update patient')
    }

    const result = await response.json()
    console.log('Backend success response:', result)
    return result
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Get single patient by ID
export const getPatientByIdFn = async (patientId: number): Promise<patient> => {
  const fullUrl = `${API_BASE_URL}/patients/${patientId}`
  const token = getAccessTokenHelper()

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to fetch patient')
    }

    return response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Get patient by user ID (fallback method)
export const getPatientByUserIdFn = async (userId: number): Promise<patient> => {
  const fullUrl = `${API_BASE_URL}/patients/user/${userId}`
  const token = getAccessTokenHelper()

  try {
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to fetch patient for user ID ${userId}`)
    }

    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// API/patients.ts
export const getPatientsCount = async (): Promise<{ total: number }> => {
  const response = await fetch(`${API_BASE_URL}/patients/count`, {
    headers: {
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })
  return response.json()
}

// Fetch all patients for a specific doctor
export const getPatientsByDoctorIdFn = async (doctorId: number): Promise<Array<any>> => {
  const fullUrl = `${API_BASE_URL}/doctors/${doctorId}/patients`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch patients for doctor')
  }

  const data = await response.json()
  return data.data || data // Handle both response formats
}
