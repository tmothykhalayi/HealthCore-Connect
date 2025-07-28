import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  deletePaymentsFn, 
  deletePaymentAdminFn,
  getPaymentsFn, 
  createPaymentFn, 
  updatePaymentFn,
  getAllPaymentsFn,
  getPharmacistPaymentsFn,
  type CreatePaymentData,
  type UpdatePaymentData
} from '@/API/payment'

export const useGetPaymentQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['payments', page, limit, search],
    queryFn: () => getPaymentsFn(page, limit, search),
  })
}

// Hook for admin to get all payments
export const useGetAllPaymentsQuery = () => {
  return useQuery({
    queryKey: ['all-payments'],
    queryFn: getAllPaymentsFn,
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

// Hook for pharmacist to get payments
export const useGetPharmacistPaymentsQuery = () => {
  return useQuery({
    queryKey: ['pharmacist-payments'],
    queryFn: getPharmacistPaymentsFn,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 3, // Retry up to 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  })
}

export const useCreatePayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPaymentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export const useUpdatePayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ paymentId, paymentData }: { paymentId: number; paymentData: UpdatePaymentData }) =>
      updatePaymentFn(paymentId, paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export const useDeletePayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePaymentsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}

export const useDeletePaymentAdmin = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deletePaymentAdminFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-payments'] })
    },
  })
}
