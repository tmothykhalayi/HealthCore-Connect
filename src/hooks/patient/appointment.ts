import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAppointmentFn } from '@/api/patient/doctor/appointment'
import { getAppointmentsFn } from '@/api/patient/doctor/appointment'
import { getPatientByUserIdFn, getAppointmentsByPatientIdFn } from '@/api/patient/patient'
import { cancelAppointmentFn, rescheduleAppointmentFn, updateAppointmentStatusFn } from '@/api/patient/appointment'
import { getUserIdHelper } from '@/lib/auth'

export const useCreateAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentData: {
      doctorId: number
      patientId: number
      appointmentDate: string
      appointmentTime: string
      patientEmail: string
      duration: number
      reason: string
      status: string
      date: string
      time: string
      title: string
    }) => createAppointmentFn(appointmentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export const useGetAppointmentsByIdQuery = (patientId: number | undefined) => {
  return useQuery({
    queryKey: ['appointments', patientId],
    queryFn: () => patientId ? getAppointmentsFn(patientId) : Promise.resolve([]),
    enabled: !!patientId,
  })
}

// New hook that gets patient ID first, then appointments
export const useGetPatientAppointmentsQuery = () => {
  const userId = getUserIdHelper()
  return useQuery({
    queryKey: ['patient-appointments', userId],
    queryFn: async () => {
      const patient = await getPatientByUserIdFn(Number(userId))
      if (!patient?.id) return []
      const appointments = await getAppointmentsByPatientIdFn(patient.id)
      if (Array.isArray(appointments)) return appointments
      if (appointments?.data && Array.isArray(appointments.data)) return appointments.data
      return []
    },
    enabled: !!userId,
  })
}

export const useCancelAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (appointmentId: number) => cancelAppointmentFn(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] })
    },
  })
}

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      appointmentId, 
      newDate, 
      newTime 
    }: { 
      appointmentId: number
      newDate: string
      newTime: string 
    }) => rescheduleAppointmentFn(appointmentId, newDate, newTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] })
    },
  })
}

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: number; status: string }) =>
      updateAppointmentStatusFn(appointmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] })
    },
  })
}
