import { getMedicineFn } from '@/api/patient/medicine'
import { useQuery } from '@tanstack/react-query'

export const useGetMedicineQuery = () => {
  return useQuery({
    queryKey: ['medicines'],
    queryFn: getMedicineFn,
  })
}
