import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAppointmentFn } from '@/api/doctor/appointment'
import { getAppointmentsFn } from '@/api/patient/doctor/appointment'

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

export const useGetAppointmentsByIdQuery = (patientId: number) => {
  return useQuery({
    queryKey: ['appointments', patientId],
    queryFn: () => getAppointmentsFn(patientId),
  })
}
