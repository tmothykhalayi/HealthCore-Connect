import { deletePharmacyOrderFn, getPharmacyOrdersFn } from '@/api/orders'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetPharmacyOrdersQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['pharmacyOrders', page, limit, search],
    queryFn: () => getPharmacyOrdersFn(page, limit, search),
  })
}

export const useDeletePharmacyOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePharmacyOrderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] })
    },
  })
}
