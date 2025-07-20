import { API_BASE_URL } from './BaseUrl';
import { getAccessTokenHelper } from '@/lib/auth';

const fetchCount = async (endpoint: string): Promise<number> => {
  const token = getAccessTokenHelper();
  const response = await fetch(`${API_BASE_URL}/${endpoint}/count`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch count for ${endpoint}`);
  }
  const data = await response.json();
  // Support both { total: number } and { data: { total: number } }
  if (typeof data.total === 'number') return data.total;
  if (data.data && typeof data.data.total === 'number') return data.data.total;
  throw new Error(`Invalid response for ${endpoint}/count`);
};

export const getUsersCount = () => fetchCount('users');
export const getPatientsCount = () => fetchCount('patients');
export const getDoctorsCount = () => fetchCount('doctors');
export const getPharmaciesCount = () => fetchCount('pharmacy');
export const getPharmacistsCount = () => fetchCount('pharmacists');
export const getOrdersCount = () => fetchCount('orders');
export const getAppointmentsCount = () => fetchCount('appointments'); 