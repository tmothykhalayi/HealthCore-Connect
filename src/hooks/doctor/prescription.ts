import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPrescriptionFn,
  getPrescriptionFn,
} from '@/api/doctor/prescription'
import { deletePrescriptionFn } from '@/api/prescription'

export const useGetPrescriptionQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['prescriptions', page, limit, search],
    queryFn: () => getPrescriptionFn(page, limit, search),
  })
}

export const useDeletePrescription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePrescriptionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
  })
}

export const useCreatePrescription = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPrescriptionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] })
    },
  })
}
