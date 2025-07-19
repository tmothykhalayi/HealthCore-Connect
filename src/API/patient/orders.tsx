import {API_BASE_URL} from "../BaseUrl";
import { getAccessTokenHelper } from "@/lib/auth";

export const getPharmacyOrdersFn = async (patientId: number) => {
  const fullUrl = `${API_BASE_URL}/patients/pharmacy_orders/${patientId}`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch pharmacy orders');
  }

  const data = await response.json();
  return Array.isArray(data) ? data : [data]; // Ensure we return an array
}

export const createPharmacyOrderFn = async (orderData: any) => {
  const fullUrl = `${API_BASE_URL}/patients/pharmacy_orders`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
  });

  if (!response.ok) {
    throw new Error('Failed to create pharmacy order');
  }

  return await response.json();
}