import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePaymentsFn, getPaymentsFn } from '@/api/payment'

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

export const useDeletePayment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePaymentsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
  })
}
