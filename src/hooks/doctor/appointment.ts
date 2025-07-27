import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAppointmentFn,
  deleteAppointmentFn,
  getAppointmentsFn,
} from '@/API/doctor/appointment'

export const useGetAppointmentsQuery = (
  page: number,
  limit: number,
  search: string,
) => {
  return useQuery({
    queryKey: ['appointments', page],
    queryFn: () => getAppointmentsFn(page),
  })
}

export const useGetAppointmentsByDoctorIdQuery = (doctorId: number) => {
  return useQuery({
    queryKey: ['appointments', 'doctor', doctorId],
    queryFn: () => getAppointmentsFn(doctorId),
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

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentData: {
      doctor_id: number
      patient_id: number
      status: string
      reason: string
      appointment_time: Date
      created_at: Date
    }) => createAppointmentFn(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
