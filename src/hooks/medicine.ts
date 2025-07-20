import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  deleteMedicinesFn, 
  getMedicinesFn, 
  createMedicineFn, 
  updateMedicineFn,
  type CreateMedicineData,
  type UpdateMedicineData
} from '@/api/medicine'

export const useGetMedicineQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['medicines', page, limit, search],
    queryFn: () => getMedicinesFn(page, limit, search),
  })
}

export const useCreateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createMedicineFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
    },
  })
}

export const useUpdateMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ medicineId, medicineData }: { medicineId: number; medicineData: UpdateMedicineData }) =>
      updateMedicineFn(medicineId, medicineData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
    },
  })
}

export const useDeleteMedicine = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMedicinesFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] })
    },
  })
}
