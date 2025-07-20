import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getPharmacyOrdersForPharmacist,
  getPrescriptionsForPharmacist,
  getPharmacistByUserId,
  getPharmacyByUserId,
  updateOrderStatus,
  getPatientsWithOrders
} from '@/api/pharmacist'
import { getUserIdHelper } from '@/lib/auth'

// Hook to get pharmacist profile
export const usePharmacistProfile = () => {
  const userId = getUserIdHelper()
  
  return useQuery({
    queryKey: ['pharmacist-profile', userId],
    queryFn: () => getPharmacistByUserId(Number(userId)),
    enabled: !!userId,
  })
}

// Hook to get pharmacy details
export const usePharmacyDetails = () => {
  const userId = getUserIdHelper()
  
  return useQuery({
    queryKey: ['pharmacy-details', userId],
    queryFn: () => getPharmacyByUserId(Number(userId)),
    enabled: !!userId,
  })
}

// Hook to get pharmacy orders for pharmacist
export const usePharmacyOrders = (pharmacyId: number) => {
  return useQuery({
    queryKey: ['pharmacy-orders', pharmacyId],
    queryFn: () => getPharmacyOrdersForPharmacist(pharmacyId),
    enabled: !!pharmacyId,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Hook to get prescriptions for pharmacist
export const usePharmacistPrescriptions = (pharmacyId: number) => {
  return useQuery({
    queryKey: ['pharmacist-prescriptions', pharmacyId],
    queryFn: () => getPrescriptionsForPharmacist(pharmacyId),
    enabled: !!pharmacyId,
    refetchInterval: 60000, // Refetch every minute
  })
}

// Hook to get patients with orders
export const usePatientsWithOrders = (pharmacyId: number) => {
  return useQuery({
    queryKey: ['patients-with-orders', pharmacyId],
    queryFn: () => getPatientsWithOrders(pharmacyId),
    enabled: !!pharmacyId,
    refetchInterval: 120000, // Refetch every 2 minutes
  })
}

// Hook to update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      updateOrderStatus(orderId, status),
    onSuccess: () => {
      // Invalidate and refetch pharmacy orders
      queryClient.invalidateQueries({ queryKey: ['pharmacy-orders'] })
    },
  })
} 