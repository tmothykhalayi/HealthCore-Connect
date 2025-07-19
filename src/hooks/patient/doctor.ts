import { getDoctorsFn } from '@/api/patient/doctor/doctor'
import { useQuery } from '@tanstack/react-query'

export const useGetDoctorQuery = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctorsFn,
  })
}
