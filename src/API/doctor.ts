// Interface for Doctor Profile
export interface doctor {
  userId: number
  specialization: string
  licenseNumber: string
  yearsOfExperience: number
  phoneNumber: string
  education?: string
  officeAddress: string
  consultationFee?: number
  availableDays?: string[]
  availableHours?: string
  status?: string
}
// API/users.ts
import { API_BASE_URL } from './BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'
import type { TDoctor } from '@/types/alltypes'

export const getDoctorFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: TDoctor[]
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/doctors?${params.toString()}`
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
