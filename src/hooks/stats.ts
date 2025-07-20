import { useQuery } from '@tanstack/react-query';
import {
  getUsersCount,
  getPatientsCount,
  getDoctorsCount,
  getPharmaciesCount,
  getPharmacistsCount,
  getOrdersCount,
  getAppointmentsCount,
} from '@/api/stats';

export const useUsersCount = () => useQuery({ queryKey: ['users-count'], queryFn: getUsersCount });
export const usePatientsCount = () => useQuery({ queryKey: ['patients-count'], queryFn: getPatientsCount });
export const useDoctorsCount = () => useQuery({ queryKey: ['doctors-count'], queryFn: getDoctorsCount });
export const usePharmaciesCount = () => useQuery({ queryKey: ['pharmacies-count'], queryFn: getPharmaciesCount });
export const usePharmacistsCount = () => useQuery({ queryKey: ['pharmacists-count'], queryFn: getPharmacistsCount });
export const useOrdersCount = () => useQuery({ queryKey: ['orders-count'], queryFn: getOrdersCount });
export const useAppointmentsCount = () => useQuery({ queryKey: ['appointments-count'], queryFn: getAppointmentsCount }); 