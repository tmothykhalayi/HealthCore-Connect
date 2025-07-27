import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  deletePaymentsFn, 
  deletePaymentAdminFn,
  getPaymentsFn, 
  createPaymentFn, 
  updatePaymentFn,
  getAllPaymentsFn,
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
