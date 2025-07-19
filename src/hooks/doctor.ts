import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteDoctorFn, getDoctorFn } from '@/api/doctor'

export const useGetDoctorQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['doctors', page, limit, search],
    queryFn: () => getDoctorFn(page, limit, search),
  })
}

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDoctorFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
    },
  })
}
