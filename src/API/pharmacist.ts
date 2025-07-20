// interface pharmacist.ts
export interface Pharmacist {
  userId: number
  pharmacyName?: string
  licenseNumber?: string
}

// API functions for pharmacist dashboard
import { API_BASE_URL } from './BaseUrl'
import { getAccessTokenHelper } from '@/lib/auth'

// Get pharmacy orders for pharmacist's pharmacy
export const getPharmacyOrdersForPharmacist = async (pharmacyId: number) => {
  const fullUrl = `${API_BASE_URL}/orders/pharmacy/${pharmacyId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacy orders')
  }

  const data = await response.json()
  return data.data || data // Handle both response formats
}

// Get prescriptions for pharmacist's pharmacy
export const getPrescriptionsForPharmacist = async (pharmacyId: number) => {
  const fullUrl = `${API_BASE_URL}/medical-records/prescriptions/pharmacy/${pharmacyId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch prescriptions')
  }

  const data = await response.json()
  return data.data || data
}

// Get pharmacist profile by user ID
export const getPharmacistByUserId = async (userId: number) => {
  const fullUrl = `${API_BASE_URL}/pharmacists/user/${userId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacist profile')
  }

  return await response.json()
}

// Get pharmacy details by user ID
export const getPharmacyByUserId = async (userId: number) => {
  const fullUrl = `${API_BASE_URL}/pharmacy/user/${userId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacy details')
  }

  return await response.json()
}

// Update order status
export const updateOrderStatus = async (orderId: number, status: string) => {
  const fullUrl = `${API_BASE_URL}/orders/${orderId}/status`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    throw new Error('Failed to update order status')
  }

  return await response.json()
}

// Get all patients who have orders with this pharmacy
export const getPatientsWithOrders = async (pharmacyId: number) => {
  const fullUrl = `${API_BASE_URL}/orders/pharmacy/${pharmacyId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch patients with orders')
  }

  const data = await response.json()
  const orders = data.data || data
  
  // Extract unique patients from orders
  const patientIds = [...new Set(orders.map((order: any) => order.patientId))] as number[]
  
  // Fetch patient details for each unique patient
  const patients = await Promise.all(
    patientIds.map(async (patientId: number) => {
      const patientResponse = await fetch(`${API_BASE_URL}/patients/${patientId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (patientResponse.ok) {
        return await patientResponse.json()
      }
      return null
    })
  )
  
  return patients.filter(Boolean)
}

// Admin API functions for managing pharmacists
export const getAllPharmacists = async (page = 1, limit = 10, search = '') => {
  const fullUrl = `${API_BASE_URL}/pharmacists?page=${page}&limit=${limit}&search=${search}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacists')
  }

  const data = await response.json()
  
  // Map backend response to frontend expected format
  const mappedData = (data.data || []).map((pharmacist: any) => ({
    pharmacist_id: pharmacist.id,
    name: `${pharmacist.user?.firstName || ''} ${pharmacist.user?.lastName || ''}`.trim(),
    email: pharmacist.user?.email || '',
    pharmacy_name: pharmacist.pharmacy?.name || '',
    license_number: pharmacist.licenseNumber || '',
    phone_number: pharmacist.user?.phoneNumber || '',
    status: pharmacist.user?.isActive ? 'active' : 'inactive',
  }))

  return {
    data: mappedData,
    total: data.total || 0,
    page: data.page || page,
    limit: data.limit || limit,
  }
}

export const getPharmacistById = async (pharmacistId: number) => {
  const fullUrl = `${API_BASE_URL}/pharmacists/${pharmacistId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacist')
  }

  const pharmacist = await response.json()
  
  // Map backend response to frontend expected format
  return {
    pharmacist_id: pharmacist.id,
    name: `${pharmacist.user?.firstName || ''} ${pharmacist.user?.lastName || ''}`.trim(),
    email: pharmacist.user?.email || '',
    pharmacy_name: pharmacist.pharmacy?.name || '',
    license_number: pharmacist.licenseNumber || '',
    phone_number: pharmacist.user?.phoneNumber || '',
    status: pharmacist.user?.isActive ? 'active' : 'inactive',
  }
}

export const createPharmacist = async (pharmacistData: any) => {
  const fullUrl = `${API_BASE_URL}/pharmacists`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(pharmacistData),
  })

  if (!response.ok) {
    throw new Error('Failed to create pharmacist')
  }

  return await response.json()
}

export const updatePharmacist = async (pharmacistId: number, pharmacistData: any) => {
  const fullUrl = `${API_BASE_URL}/pharmacists/${pharmacistId}`
  const token = getAccessTokenHelper()

  console.log('Frontend sending pharmacist data:', pharmacistData);

  // Map frontend fields to backend expected fields
  // Backend only accepts: userId, pharmacyId, licenseNumber
  const payload = {
    licenseNumber: pharmacistData.license_number,
  };

  console.log('Mapped payload for backend:', payload);

  const response = await fetch(fullUrl, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Update pharmacist error response:', errorText);
    throw new Error(`Failed to update pharmacist: ${errorText}`);
  }

  const result = await response.json();
  console.log('Update pharmacist response:', result);
  return result;
}

export const deletePharmacist = async (pharmacistId: number) => {
  const fullUrl = `${API_BASE_URL}/pharmacists/${pharmacistId}`
  const token = getAccessTokenHelper()

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete pharmacist')
  }

  return await response.json()
}
