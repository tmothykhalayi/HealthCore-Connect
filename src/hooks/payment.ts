import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  deletePaymentsFn, 
  getPaymentsFn, 
  createPaymentFn, 
  updatePaymentFn,
  type CreatePaymentData,
  type UpdatePaymentData
} from '@/api/payment'

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
