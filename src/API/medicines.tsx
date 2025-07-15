// API/patients.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TMedicine } from "@/Types/types";

export const getMedicinesFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TMedicine[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${url}/medicines?${params.toString()}`;
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

export const deleteMedicinesFn = async (medicineId: number): Promise<void> => {
  const fullUrl = `${url}/medicines/${medicineId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete medicine');
  }
}

export const createMedicineFn = async (medicine: TMedicine): Promise<TMedicine> => {
  const fullUrl = `${url}/medicines`;

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(medicine),
  });

  if (!response.ok) {
    throw new Error('Failed to create medicine');
  }

  return response.json();
}