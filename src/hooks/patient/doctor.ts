import { useQuery } from '@tanstack/react-query'
import { getDoctorsFn } from '@/api/patient/doctor/doctor'

export const useGetDoctorQuery = () => {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctorsFn,
  })
}
