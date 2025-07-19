import axios from 'axios'
import { API_BASE_URL } from './BaseUrl'

export interface Medication {
  id?: string
  name: string
  description?: string
  dosage: string
  price: number
  stock: number
  category: string
  requiresPrescription: boolean
  createdAt?: string
  updatedAt?: string
}

export interface PharmacyOrder {
  id?: string
  patientId: string
  patientName: string
  items: {
    medicationId: string
    medicationName: string
    quantity: number
    price: number
  }[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  deliveryAddress?: string
  createdAt?: string
  updatedAt?: string
}

// GET all medications
export const getMedications = async (): Promise<Medication[]> => {
  const response = await axios.get(`${API_BASE_URL}/pharmacy/medications`)
  return response.data
}

// GET medication by ID
export const getMedicationById = async (id: string): Promise<Medication> => {
  const response = await axios.get(`${API_BASE_URL}/pharmacy/medications/${id}`)
  return response.data
}

// CREATE medication
export const createMedication = async (
  medicationData: Partial<Medication>,
): Promise<Medication> => {
  const response = await axios.post(
    `${API_BASE_URL}/pharmacy/medications`,
    medicationData,
  )
  return response.data
}

// UPDATE medication
export const updateMedication = async (
  id: string,
  medicationData: Partial<Medication>,
): Promise<Medication> => {
  const response = await axios.put(
    `${API_BASE_URL}/pharmacy/medications/${id}`,
    medicationData,
  )
  return response.data
}

// DELETE medication
export const deleteMedication = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/pharmacy/medications/${id}`)
}

// Update medication stock
export const updateMedicationStock = async (
  id: string,
  stock: number,
): Promise<Medication> => {
  const response = await axios.patch(
    `${API_BASE_URL}/pharmacy/medications/${id}/stock`,
    { stock },
  )
  return response.data
}

// GET all orders
export const getOrders = async (): Promise<PharmacyOrder[]> => {
  const response = await axios.get(`${API_BASE_URL}/pharmacy/orders`)
  return response.data
}

// GET orders by patient ID
export const getOrdersByPatient = async (
  patientId: string,
): Promise<PharmacyOrder[]> => {
  const response = await axios.get(
    `${API_BASE_URL}/pharmacy/orders/patient/${patientId}`,
  )
  return response.data
}

// GET order by ID
export const getOrderById = async (id: string): Promise<PharmacyOrder> => {
  const response = await axios.get(`${API_BASE_URL}/pharmacy/orders/${id}`)
  return response.data
}

// CREATE order
export const createOrder = async (
  orderData: Partial<PharmacyOrder>,
): Promise<PharmacyOrder> => {
  const response = await axios.post(
    `${API_BASE_URL}/pharmacy/orders`,
    orderData,
  )
  return response.data
}

// UPDATE order
export const updateOrder = async (
  id: string,
  orderData: Partial<PharmacyOrder>,
): Promise<PharmacyOrder> => {
  const response = await axios.put(
    `${API_BASE_URL}/pharmacy/orders/${id}`,
    orderData,
  )
  return response.data
}

// DELETE order
export const deleteOrder = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/pharmacy/orders/${id}`)
}

// Update order status
export const updateOrderStatus = async (
  id: string,
  status: PharmacyOrder['status'],
): Promise<PharmacyOrder> => {
  const response = await axios.patch(
    `${API_BASE_URL}/pharmacy/orders/${id}/status`,
    { status },
  )
  return response.data
}
