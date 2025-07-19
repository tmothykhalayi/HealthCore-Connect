import { useQuery } from '@tanstack/react-query'
import { getMedicineFn } from '@/api/patient/medicine'

export const useGetMedicineQuery = () => {
  return useQuery({
    queryKey: ['medicines'],
    queryFn: getMedicineFn,
  })
}
