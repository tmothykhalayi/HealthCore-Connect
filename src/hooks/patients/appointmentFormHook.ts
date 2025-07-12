import {  postAppointmentFormFn } from '@/API/patient Api/appointmentForm'
import { useMutation} from '@tanstack/react-query'

export const usePostAppointmentFormHook = () => {
  return useMutation({
    mutationKey: ['appointmentForm'],
    mutationFn: postAppointmentFormFn,
  })
}

