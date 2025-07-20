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
