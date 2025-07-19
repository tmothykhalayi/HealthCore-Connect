import { useQuery } from '@tanstack/react-query'
import { getPatientsFn } from '@/api/patient'

export const useGetPatientsQuery = () => {
  return useQuery({
    queryKey: ['patients'],
    queryFn: () => getPatientsFn(),
  })
}
