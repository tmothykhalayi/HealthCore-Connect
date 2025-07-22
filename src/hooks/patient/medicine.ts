import { useQuery } from '@tanstack/react-query'
import { getMedicineFn } from '@/api/patient/medicine'

export const useGetMedicineQuery = (page = 1, limit = 10, search = '', userId?: number, doctorId?: number) => {
  return useQuery({
    queryKey: ['medicines', page, limit, search, userId, doctorId],
    queryFn: () => getMedicineFn(page, limit, search, userId, doctorId),
  })
}
