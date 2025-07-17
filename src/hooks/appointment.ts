import { deleteAppointmentFn, getAppointmentsFn } from '@/API/appointments'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetAppointmentQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['appointments', page],
    queryFn: () => getAppointmentsFn(page),
  })
}

export const useDeleteAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteAppointmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
