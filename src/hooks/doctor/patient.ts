import { useQuery } from '@tanstack/react-query'
import { getAllPatientsFn } from '@/api/patient'

export const useGetPatientsQuery = () => {
  return useQuery({
    queryKey: ['all-patients'],
    queryFn: getAllPatientsFn,
  })
}
