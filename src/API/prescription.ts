import { API_BASE_URL } from './BaseUrl'
import type { TPrescription } from '@/types/alltypes'
import { getAccessTokenHelper } from '@/lib/auth'

export const getPrescriptionsFn = async (
  page = 1,
  limit = 10,
  search = '',
): Promise<{
  data: Array<TPrescription>
  total: number
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search,
  })

  const fullUrl = `${API_BASE_URL}/prescriptions?${params.toString()}`
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
  
  // Map backend response to frontend expected format
  const mappedData = result.data.map((prescription: any) => ({
    prescription_id: prescription.id,
    patient_id: prescription.patientId || prescription.patient?.id || 0,
    doctor_id: prescription.doctorId || prescription.doctor?.id || 0,
    appointment_id: prescription.appointmentId || 0,
    notes: prescription.notes || '',
    created_at: prescription.issueDate || prescription.createdAt,
  }))

  return {
    data: mappedData,
    total: result.total,
  }
}

export const deletePrescriptionFn = async (
  prescriptionId: number,
): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/prescriptions/${prescriptionId}`

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessTokenHelper()}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete prescription')
  }
}

// CREATE new prescription
//

// UPDATE prescription (existing)
export const updatePrescriptionFn = async ({
  prescriptionId,
  prescriptionData,
}: {
  prescriptionId: number
  prescriptionData: TPrescription
}): Promise<TPrescription> => {
  const fullUrl = `${API_BASE_URL}/prescriptions/${prescriptionId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(prescriptionData),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Failed to update prescription')
  }

  return response.json()
}
