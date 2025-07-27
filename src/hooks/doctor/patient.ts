import { useQuery } from '@tanstack/react-query'
import { getAllPatientsSimplifiedFn } from '@/API/patient'

export const useGetPatientsQuery = () => {
  return useQuery({
    queryKey: ['all-patients-simplified'],
    queryFn: getAllPatientsSimplifiedFn,
  })
}
