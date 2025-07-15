// API/records.ts
import url from "@/constants/urls";
import { getAccessTokenHelper } from "@/lib/authHelper";
import type { TRecord } from "@/Types/types";

export const getRecordFn = async (page = 1, limit = 10, search = ''): Promise<{
  data: TRecord[];
  total: number;
}> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search: search
  });

  const fullUrl = `${url}/records?${params.toString()}`;
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

export const deleteRecordFn = async (recordId: number): Promise<void> => {
  const fullUrl = `${url}/records/${recordId}`;

  const response = await fetch(fullUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete record');
  }
}

export const createRecordFn = async (recordData: TRecord): Promise<TRecord> => {
  const fullUrl = `${url}/records`;

  const response = await fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAccessTokenHelper()}`,
    },
    body: JSON.stringify(recordData),
  });

  if (!response.ok) {
    throw new Error('Failed to create record');
  }

  return response.json();
} 