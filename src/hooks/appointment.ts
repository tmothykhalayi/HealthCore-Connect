import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deleteAppointmentFn, getAppointmentsFn } from '@/api/Appointment'

export const useGetAppointmentQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['appointments', page, limit, search],
    queryFn: () => getAppointmentsFn(page, limit, search),
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
