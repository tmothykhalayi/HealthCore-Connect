import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPharmacyOrderFn,
  getPharmacyOrdersFn,
} from '@/api/patient/orders'

export const useGetPharmacyOrders = (patient_id: number) => {
  return useQuery({
    queryKey: ['pharmacyOrders', patient_id],
    queryFn: () => getPharmacyOrdersFn(patient_id),
    enabled: !!patient_id, // Only run query if patient_id is provided
  })
}

export const useCreatePharmacyOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderData: {
      patientId: number;
      pharmacyId: number;
      medicineId: number;
      quantity: number;
      orderDate: string;
      status: string;
      totalAmount: number;
      OrderId: string;
    }) => createPharmacyOrderFn(orderData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({
        queryKey: ['pharmacyOrders'],
      })
    },
  })
}
