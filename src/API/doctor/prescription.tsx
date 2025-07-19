// API/patients.ts
import {API_BASE_URL} from "../BaseUrl";
import { getAccessTokenHelper } from "@/lib/auth";
import type { TPrescription } from "@/types/alltypes";

export const getPrescriptionFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TPrescription[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${API_BASE_URL}/prescriptions?${params.toString()}`;
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

export const deletePrescriptionFn = async (prescriptionId: number): Promise<void> => {
  const fullUrl = `${API_BASE_URL}/prescriptions/${prescriptionId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete prescription');
  }
}

export const createPrescriptionFn = async (prescriptionData: TPrescription): Promise<TPrescription> => {
  const fullUrl = `${API_BASE_URL}/prescriptions`;
  const token = getAccessTokenHelper();

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(prescriptionData),
  });

  if (!response.ok) {
    throw new Error('Failed to create prescription');
  }

  return response.json();
}