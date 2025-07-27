import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  getPharmacyOrdersForPharmacist,
  getPrescriptionsForPharmacist,
  getPharmacistByUserId,
  getPharmacyByUserId,
  updateOrderStatus,
  getPatientsWithOrders,
  getAllPharmacists,
  getPharmacistById,
  createPharmacist,
  updatePharmacist,
  deletePharmacist,
  getAllOrders
} from '@/API/pharmacist'
import { getUserIdHelper } from '@/lib/auth'

// Hook to get pharmacist profile
export const usePharmacistProfile = () => {
  const userId = getUserIdHelper()
  
  return useQuery({
    queryKey: ['pharmacist-profile', userId],
    queryFn: () => getPharmacistByUserId(Number(userId)),
    enabled: !!userId,
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

// Hook to get pharmacy details
export const usePharmacyDetails = () => {
  const userId = getUserIdHelper()
  
  return useQuery({
    queryKey: ['pharmacy-details', userId],
    queryFn: () => getPharmacyByUserId(Number(userId)),
    enabled: !!userId,
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

// Hook to get pharmacy orders for pharmacist
export const usePharmacyOrders = (pharmacyId: number) => {
  return useQuery({
    queryKey: ['pharmacy-orders', pharmacyId],
    queryFn: () => getPharmacyOrdersForPharmacist(pharmacyId),
    enabled: !!pharmacyId,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
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

// Admin hooks for managing pharmacists
export const useGetAllPharmacists = (page: number, limit: number, search: string) => {
  return useQuery({
    queryKey: ['pharmacists', page, limit, search],
    queryFn: () => getAllPharmacists(page, limit, search),
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
  })
}

export const useGetPharmacistById = (pharmacistId: number) => {
  return useQuery({
    queryKey: ['pharmacist', pharmacistId],
    queryFn: () => getPharmacistById(pharmacistId),
    enabled: !!pharmacistId,
  })
}

export const useCreatePharmacist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacists'] })
    },
  })
}

export const useUpdatePharmacist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pharmacistId, pharmacistData }: { pharmacistId: number; pharmacistData: any }) => 
      updatePharmacist(pharmacistId, pharmacistData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacists'] })
    },
  })
}

export const useDeletePharmacist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePharmacist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacists'] })
    },
  })
} 

// Hook to get all orders (global)
export const useGetAllOrders = () => {
  return useQuery({
    queryKey: ['all-orders'],
    queryFn: getAllOrders,
  })
} 