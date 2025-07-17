import { createPharmacyOrderFn, getPharmacyOrdersFn } from '@/API/patient Api/pharmacy_orders'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

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
      patient_id: number
      medication_name: string
      dosage: string
      quantity: number
      status: string
      created_at: Date
    }) => createPharmacyOrderFn(orderData),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ 
        queryKey: ['pharmacyOrders'] 
      })
    }
  })
}