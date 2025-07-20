import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { 
  deleteAppointmentFn, 
  getAppointmentsFn, 
  getAppointmentByIdFn,
  createAppointmentFn,
  updateAppointmentFn
} from '@/api/Appointment'

export const useGetAppointmentQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['appointments', page, limit, search],
    queryFn: () => getAppointmentsFn(page, limit, search),
    staleTime: 0, // Always consider data stale to force refresh
    refetchOnWindowFocus: true,
  })
}

export const useGetAppointmentById = (appointmentId: number) => {
  return useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointmentByIdFn(appointmentId),
    enabled: !!appointmentId,
  })
}

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAppointmentFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ appointmentId, appointmentData }: { appointmentId: number; appointmentData: any }) => 
      updateAppointmentFn(appointmentId, appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
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
