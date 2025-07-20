import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePharmacyOrderFn, getPharmacyOrdersFn, createPharmacyOrderFn, updatePharmacyOrderFn } from '@/api/orders'

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

export const useCreatePharmacyOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPharmacyOrderFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] })
    },
  })
}

export const useUpdatePharmacyOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ orderId, orderData }: { orderId: number; orderData: any }) => 
      updatePharmacyOrderFn(orderId, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacyOrders'] })
    },
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
