import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAppointmentFn } from '@/api/patient/doctor/appointment'
import { getAppointmentsFn } from '@/api/patient/doctor/appointment'
import { getPatientByUserIdFn, getAppointmentsByPatientIdFn } from '@/api/patient/patient'
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

export const useGetAppointmentsByIdQuery = (patientId: number) => {
  return useQuery({
    queryKey: ['appointments', patientId],
    queryFn: () => getAppointmentsFn(patientId),
  })
}

// New hook that gets patient ID first, then appointments
export const useGetPatientAppointmentsQuery = () => {
  const userId = getUserIdHelper()
  
  return useQuery({
    queryKey: ['patient-appointments', userId],
    queryFn: async () => {
      // First get the patient profile for the current user
      const patient = await getPatientByUserIdFn(Number(userId))
      console.log('Patient profile:', patient)
      
      // Then get appointments for that patient
      const appointments = await getAppointmentsByPatientIdFn(patient.id)
      console.log('Patient appointments:', appointments)
      
      return appointments
    },
    enabled: !!userId,
  })
}
